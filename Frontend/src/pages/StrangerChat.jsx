import React, { useState, useEffect, useRef } from "react";
import { MdAttachFile } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import music from "./iphone-sms-tone-original-mp4-5732.mp3";
import toast from "react-hot-toast";
import { useAsyncMutation } from "../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useGetRelationStatusQuery,
} from "../redux/api/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StrangerChat = ({ socket, username, room, connectedUser, bothLoggedIn, partnerId,partner, goBackToHome }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const notification = new Audio(music);
  const containRef = useRef(null);
  const [relation, setRelation] = useState("none");
  const [requestId,setRequestId] = useState("")
   
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  // ✅ Send Message
  const sendMessage = async () => {
    if (!image && !currentMessage.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (image) {
      const reader = new FileReader();
      reader.onload = function () {
        const imageData = {
          id: Math.random(),
          room,
          author: username,
          image: reader.result,
          type: "image",
          time,
        };

        socket.emit("send_image", imageData);
        setImage(null);
        setImagePreview(null);
        notification.play();
      };
      reader.readAsDataURL(image);
    } else {
      const messageData = {
        id: Math.random(),
        room,
        author: username,
        type: "text",
        message: currentMessage,
        time,
      };

      socket.emit("send_message", messageData);
      setCurrentMessage("");
      notification.play();
      setTimeout(() => setSending(false), 300); // small delay
    }
  };

  // ✅ Disconnect
  const handleDisconnect = () => {
    socket.emit("disconnect_chat", { room, username });
    goBackToHome();
  };

  // ✅ Image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentMessage(""); // clear text
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ❌ Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // ✅ Receive messages
 useEffect(() => {
  const handleReceiveMsg = (data) => {
    setMessageList((list) => [...list, data]);
  };

  const handleDisconnectNotification = () => {
    toast.error("Your partner has skipped the chat.");
    goBackToHome();
  };

  // ✅ Remove old listeners FIRST
  socket.off("receive_message");
  socket.off("receive_image");
  socket.off("partner_disconnected");

  // ✅ Then add new ones
  socket.on("receive_message", handleReceiveMsg);
  socket.on("receive_image", handleReceiveMsg);
  socket.on("partner_disconnected", handleDisconnectNotification);

  return () => {
    socket.off("receive_message", handleReceiveMsg);
    socket.off("receive_image", handleReceiveMsg);
    socket.off("partner_disconnected", handleDisconnectNotification);
  };
}, [socket]);

  // ✅ Auto scroll
  useEffect(() => {
    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [messageList]);

  // ✅ Memory leak fix
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
    setRelation("requested"); 
  };

  const friendRequestHandler = async ({ requestId, accept }) => {
    console.log("requestId",requestId)
    await acceptRequest("Accepting...", { requestId: requestId, accept });
    if(accept){
      setRelation("friends")
      setRequestId("")
    }
    else{
       setRelation("none")
        setRequestId("")
    }
  };


 const { data: relationData, isLoading, refetch } = useGetRelationStatusQuery(
   partnerId ,
  {
    skip: !partnerId || !bothLoggedIn,
    refetchOnMountOrArgChange: true,
  }
);

useEffect(() => {
  if (relationData) {
    console.log("relationData",relationData);
    setRelation(relationData.status);
    if(relationData.status=="pending")
    {
      setRequestId(relationData.requestId);
    }
  }
}, [relationData]);

useEffect(() => {
  const handleChatCreated = (data) => {

    // ✅ STEP 5 → STOP STRANGER CHAT
    console.log("ohhhhhhh1",data)
    socket.emit("disconnect_chat", { room, username });
    // ✅ THEN redirect
    navigate(`/chat/${data.chatId}`);
  };
  console.log("ohhhhhhh2")
  socket.on("CHAT_CREATED", handleChatCreated);
  console.log("ohhhhhhh3")

  return () => {
    socket.off("CHAT_CREATED", handleChatCreated);
  };
}, [socket, navigate, room, username]);


   
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        Welcome {username}
      </h1>

      <div className="font-bold text-green-400 mb-4">
        You are connected with {connectedUser}
      </div>
       
      {partner && (
        <div className="w-full md:w-3/4 lg:w-1/2 bg-gray-800 rounded-xl shadow-md p-4 mb-4 flex items-center gap-4 border border-gray-700">

          {/* Avatar */}
          <div className="relative">
            <img
              src={partner.avatar.url || "/default.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
            />

            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
          </div>

          {/* User Info */}
          <div className="flex flex-col flex-1">
            <h2 className="text-lg font-semibold">{partner.username}</h2>
            <p className="text-sm text-gray-400 truncate max-w-[180px]">
              {partner.bio || "No bio available"}
            </p>
          </div>

          {/* Friend Status Button */}
            {bothLoggedIn && (
            <>
              {relation === "none" && (
                <button onClick={()=>{addFriendHandler(partnerId)}} className="bg-green-500 px-3 py-1 rounded">
                  Add Friend
                </button>
              )}

              {relation === "requested" && (
                <button disabled className="bg-gray-500 px-3 py-1 rounded">
                  Requested
                </button>
              )}

              {relation === "pending" && (
                < div className="flex gap-3">
                <button onClick={()=>{friendRequestHandler({requestId, accept: true })}} className="bg-blue-500 px-3 py-1 rounded">
                  Accept
                </button>
                <button onClick={()=>{friendRequestHandler({ requestId, accept: false })}} className="bg-red-500 px-3 py-1 rounded">
                  Reject
                </button>
                </div>
              )}

              {relation === "friends" && (
                <button disabled className="bg-green-700 px-3 py-1 rounded">
                  Friends
                </button>
              )}
            </>
          )}
        </div>
      )}


     

      <div className="w-full md:w-3/4 lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-4">
        {/* Messages */}
        <div
          className="h-96 overflow-y-auto border-2 border-yellow-400 rounded-lg p-3"
          ref={containRef}
        >
          {messageList.map((data) => (
            <div
              key={data.id}
              className={`mb-4 ${
                username === data.author ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`p-2 rounded-lg inline-block ${
                  username === data.author
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                {data.type === "text" ? (
                  <p>{data.message}</p>
                ) : (
                  <img
                    src={data.image}
                    alt="sent"
                    className="max-w-60 rounded-lg"
                  />
                )}
              </div>
              <p className="text-sm text-gray-400">{data.time}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex flex-col mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDisconnect}
              className="p-2 bg-red-500 rounded-lg hover:bg-red-600"
            >
              ESC
            </button>

            {/* Text Input */}
            <input
              value={currentMessage}
              type="text"
              placeholder="Type message"
              disabled={!!image}
              className="flex-1 p-2 bg-gray-700 rounded-lg disabled:opacity-50"
              onChange={(e) => {
                setImage(null);
                setImagePreview(null);
                setCurrentMessage(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            {/* Send */}
            <button
              onClick={sendMessage}
              disabled={!image && !currentMessage.trim()}
              className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              ▶
            </button>

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              id="imageInput"
              className="hidden"
              disabled={currentMessage.length > 0}
              onChange={handleImageChange}
            />

            <label
              htmlFor="imageInput"
              className={`p-2 bg-gray-700 rounded-lg cursor-pointer ${
                currentMessage.length > 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-600"
              }`}
            >
              <MdAttachFile />
            </label>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex items-center gap-2 mt-2">
              <img
                src={imagePreview}
                alt="preview"
                className="max-w-[60px] rounded-lg"
              />
              <button
                onClick={removeImage}
                className="p-1 bg-red-500 rounded-full hover:bg-red-600"
              >
                <IoClose />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrangerChat;