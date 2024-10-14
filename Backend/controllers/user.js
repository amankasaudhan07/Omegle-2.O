import { User } from '../models/user.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { Chat } from '../models/chat.js'
import { Request } from '../models/request.js';
import { emitEvent,uploadFilesToCloudinary,cookieOptions,sendToken } from '../utils/features.js';
import { ALERT,NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import {getOtherMember} from '../lib/helper.js'

export const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  try {
    if (!file) return res.json({message:"Please Upload Avatar"});
  
    const result = await uploadFilesToCloudinary([file]);
  
    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    let user;
    user = await User.findOne({ username });
    if (user) {
      // console.log("user detail : ",user);
      return res.json({ message: "UserName already exist...", success: false });
    }

     user = await User.create({
      name,
      bio,
      username,
      password,
      avatar,
    });
  
    sendToken(res, user, 201, "User created");
  }
  catch (error) {
    res.json({ message: error.message })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    // console.log(user);
    if (!user) {
      return res.json({ message: "user not found..", success: false });
    }
    //  console.log(password,user.password);
    const validPass = await bcrypt.compare(password, user.password);


    if (!validPass) {
      return res.json({ message: "Incorrect password..", success: false });
    }
    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
  }
  catch (error) {
    res.json({ message: "something went wrong" });
  }
}

export const logout =async (req, res) => {
  try {
    return res
    .status(200)
    .cookie("token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const getMyProfile =async (req, res) => {
  //  console.log(req.user);
  try {

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({message:"User not found"});
    res.status(200).json({
      message: "This is Your profile",
      success: true,
      user

    })

    //  console.log(data);
  }
  catch (err) {
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
}

const searchUser = async (req, res) => {

  try {
    const { name = "" } = req.query;

    // Finding All my chats
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    //  extracting All Users from my chats means friends or people I have chatted with
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    // Finding all users except me and my friends
    const allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" },
    });

    // Modifying the response
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      users,
    });
  }
  catch (err) {
    throw (err);
  }
};

const sendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const request = await Request.findOne({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user },
      ],
    });

    if (request) return res.status(400).json({ message: "Request already sent", success: false });

    await Request.create({
      sender: req.user,
      receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  }
  catch (err) {
    throw (err);
  }
};

const acceptFriendRequest = async (req, res, next) => {

  try {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request) return res.status(404).json({ message: "Request not found", success: false });

    if (request.receiver._id.toString() !== req.user.toString())
      return res.status(401).json({ message: "You are not authorized to accept this request", success: false });

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend Request Rejected",
      });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Friend Request Accepted",
      senderId: request.sender._id,
    });
  }
  catch (err) {
    throw (err);
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const requests = await Request.find({ receiver: req.user }).populate(
      "sender",
      "name avatar"
    );
    console.log("sender",requests);

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      allRequests,
    });
  }
  catch (err) {
    throw (err);
  }
};

const getMyFriends = async (req, res) => {
  const chatId = req.query.chatId;

  try {
    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");

    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMember(members, req.user);

      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });

    if (chatId) {
      const chat = await Chat.findById(chatId);

      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );

      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }

  }
  catch (err) {
    throw (err);
  }
};

export { searchUser, sendFriendRequest, acceptFriendRequest, getMyFriends, getMyNotifications };