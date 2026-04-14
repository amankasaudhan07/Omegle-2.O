import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './utils/features.js';
import cookieParser from 'cookie-parser'

import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import {getSockets} from './lib/helper.js'

import userRoute from './routes/user.js';
import chatRoute from './routes/chat.js';
import adminRoute from './routes/admin.js';

import { Server } from 'socket.io';
import  { createServer } from 'http'
import {   CHAT_JOINED,
    CHAT_LEAVED,
    NEW_MESSAGE,
    NEW_MESSAGE_ALERT,
    ONLINE_USERS,
    START_TYPING,
    STOP_TYPING, } from './constants/events.js';
import { Message } from './models/message.js';
import { corsOptions } from './constants/config.js';
import { socketAuthenticator } from './middlewares/auth.js';
import { User } from './models/user.js';
import { ErrorHandler } from './utils/utility.js';

dotenv.config();
dbConnect();

export const adminSecretKey =process.env.ADMIN_SECRET_KEY||"jbfdkjnbrkjdn";
const envMode = process.env.NODE_ENV.trim() ;

// 🔥 Stranger Chat Queue
let waitingUsers = [];
let strangerOnlineUsers = 0;


const userSocketIDs = new Map();
const onlineUsers = new Set();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app =express();
const server =createServer(app);
const io = new Server(server,{cors: corsOptions,});



app.set("io", io);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/v1/user',userRoute);
app.use('/api/v1/chat',chatRoute);
app.use('/api/v1/admin',adminRoute);

app.get("/", (req, res) => {
  res.send("Server running...");
});



// io.use((socket, next) => {
//   cookieParser()(
//     socket.request,
//     socket.request.res,
//     async (err) => await socketAuthenticator(err, socket, next)
//   );
// });


io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    if (err) return next(err);

    try {
      const authToken = socket.request.cookies?.token;

      // Allow stranger chat users without login
      if (!authToken) {
        socket.user = null;
        return next();
      }

      await socketAuthenticator(null, socket, next);
    } catch (error) {
      socket.user = null;
      return next();
    }
  });
});



io.on("connection",(socket)=>{
    // console.log("connected",socket.id);
     const user = socket.user;
    
      // console.log("socket user",socket);
   
    if (user) {
      userSocketIDs.set(user._id.toString(), socket.id);
    }
     
    socket.on(NEW_MESSAGE,async ({ chatId, members, message })=>{
        // if (!socket.user) return;

      //   console.log("NEW_MESSAGE members:", members);
      // console.log("socket.user:", socket.user);
      // console.log("userSocketIDs map sender:", userSocketIDs.get(socket.user?._id?.toString()));

      // const membersSocket = getSockets(members);

      // console.log("membersSocket:", membersSocket);
      // console.log("message:", message);
      // console.log("chatId:", chatId);

        // const user = socket.user;
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {   
              _id: user._id,
              name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
          };
    
          const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
          };
      
          const membersSocket = getSockets(members);
          // console.log(membersSocket);
          io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
          });
          io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
      
          try {
            await Message.create(messageForDB);
          } catch (error) {
            console.log(error);
            // throw new Error(error);
           }
        
            console.log("message",messageForRealTime); 
    })
     
    socket.on(START_TYPING, ({ members, chatId }) => {
      // if (!socket.user) return;
      const membersSockets = getSockets(members);
      socket.to(membersSockets).emit(START_TYPING, { chatId });
    });
  
    socket.on(STOP_TYPING, ({ members, chatId }) => {
      // if (!socket.user) return;
      const membersSockets = getSockets(members);
      socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });
  
    socket.on(CHAT_JOINED, ({ userId, members }) => {
      // if (!socket.user) return;
      onlineUsers.add(userId.toString());
  
      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });
  
    socket.on(CHAT_LEAVED, ({ userId, members }) => {
      // if (!socket.user) return;
      onlineUsers.delete(userId.toString());
  
      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });
    
  

    //  for stranger chat 

   strangerOnlineUsers++;
io.emit("online_users", strangerOnlineUsers);

const updateWaitingUsers = () => {
  io.emit("waiting_users", waitingUsers.length);
};

socket.on("find_partner", ({ username, userId, user }) => {
  console.log(`User ${username} ${socket.id} userId: ${userId}`);

  if (waitingUsers.length > 0) {
    const { partnerSocketId, partnerUsername, partnerUserId, partnerUser } =
      waitingUsers.pop();

    if (partnerSocketId !== socket.id) {
      const roomID = `${socket.id}-${partnerSocketId}`;

      socket.join(roomID);

      const partnerSocket = io.sockets.sockets.get(partnerSocketId);
      partnerSocket?.join(roomID);

      const bothLoggedIn = !!userId && !!partnerUserId;

      io.to(socket.id).emit("matched", {
        roomID,
        partnerUsername,
        partnerId: partnerUserId,
        bothLoggedIn,
        partnerUser,
      });

      io.to(partnerSocketId).emit("matched", {
        roomID,
        partnerUsername: username,
        partnerId: userId,
        bothLoggedIn,
        partnerUser: user,
      });

      updateWaitingUsers();
    }
  } else {
    waitingUsers.push({
      partnerSocketId: socket.id,
      partnerUsername: username,
      partnerUserId: userId || null,
      partnerUser: user || null,
    });

    updateWaitingUsers();
  }
});

socket.on("send_message", (data) => {
  io.to(data.room).emit("receive_message", data);
});

socket.on("send_image", (data) => {
  io.to(data.room).emit("receive_image", data);
});

socket.on("disconnect_chat", ({ room, username }) => {
  socket.leave(room);
  socket.to(room).emit("partner_disconnected");
  console.log(`User ${username} has disconnected from room ${room}`);
});





    socket.on("disconnect", () => {
  console.log("disconnected");

  if (user) {
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  }

  strangerOnlineUsers--;
  io.emit("online_users", strangerOnlineUsers);

  waitingUsers = waitingUsers.filter(
    (waitingUser) => waitingUser.partnerSocketId !== socket.id
  );
  io.emit("waiting_users", waitingUsers.length);
});
   
});

server.listen(3000,()=>{
    console.log("Server is running at port 3000..");
})

export { envMode, userSocketIDs };