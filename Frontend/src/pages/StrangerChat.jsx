import React, { useState, useEffect, useRef } from "react";
import { MdAttachFile } from "react-icons/md";
import music from './iphone-sms-tone-original-mp4-5732.mp3';
import toast from "react-hot-toast";

const StrangerChat = ({ socket, username, room, connectedUser, goBackToHome }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const notification = new Audio(music);
  
  const sendMessage = async () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = function () {
        const base64Image = reader.result;
        const imageData = {
          id: Math.random(),
          room: room,
          author: username,
          image: base64Image,
          type: "image",
          time: `${new Date(Date.now()).getHours() % 12}:${new Date(Date.now()).getMinutes()}`,
        };
        
        socket.emit("send_image", imageData); // Emit the image to the server
        setImagePreview(null); // Clear the preview after sending
        setImage(null); // Clear the image selection
        notification.play();
      };
      reader.readAsDataURL(image);
    } else if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        type: "text",
        message: currentMessage,
        time: `${new Date(Date.now()).getHours() % 12}:${new Date(Date.now()).getMinutes()}`,
      };

      socket.emit("send_message", messageData); // Emit the message to the server
      setCurrentMessage(""); // Clear the input after sending
      notification.play();
    }
  };

  const handleDisconnect = () => {
    socket.emit("disconnect_chat", { room, username });
    goBackToHome();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the file for sending
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const toastId = toast.loading('Logging In...');

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      setMessageList((list) => [...list, data]); // Update the message list only on receiving data
    };
    const handleDisconnectNotification = () => {
      toast.error("Your partner has skipped the chat.",{id:toastId});
      goBackToHome();
    };

    socket.on("receive_message", handleReceiveMsg);
    socket.on("receive_image", handleReceiveMsg);
    socket.on("partner_disconnected", handleDisconnectNotification);
    
    return () => {
      socket.off("receive_message", handleReceiveMsg);
      socket.off("receive_image", handleReceiveMsg);
      socket.off("partner_disconnected", handleDisconnectNotification);
    };
  }, [socket, goBackToHome]);

  const containRef = useRef(null);

  useEffect(() => {
    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [messageList]);

  return (
    <div className="chat_container flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Welcome {username}</h1>
      <div className="font-bold text-green-400 mb-4">
        You are connected with {connectedUser}
      </div>

      <div className="chat_box w-full md:w-3/4 lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-4">
        <div
          className="auto-scrolling-div h-96 overflow-y-auto border-2 border-yellow-400 rounded-lg p-3"
          ref={containRef}
        >
          {messageList.map((data) => (
            <div
              key={data.id}
              className={`message_content mb-4 ${username === data.author ? "text-right" : "text-left"}`}
            >
              <div>
                <div className={`msg p-2 rounded-lg mb-1 inline-block ${username === data.author ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}>
                  {data.type === "text" ? (
                    <p>{data.message}</p>
                  ) : (
                    <img
                      src={data.image}
                      alt="Sent"
                      className="max-w-60 h-auto rounded-lg"
                    />
                  )}
                </div>
                <div className="msg_detail text-sm text-gray-400">
                  {/* <p>{data.author}</p> */}
                  <p>{data.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat_body flex flex-col mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDisconnect}
              className="esc_button p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              ESC
            </button>
            <input
              value={currentMessage}
              type="text"
              placeholder="Type Your Message"
              className="flex-1 p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                e.key === "Enter" && sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              &#9658;
            </button>
            <input
              type="file"
              accept="image/*"
              id="imageInput"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="imageInput"
              className="icon-button p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
            >
              <MdAttachFile className="text-xl" />
            </label>
          </div>

          {/* Image Preview above send button */}
          {imagePreview && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-400">Selected Image:</p>
              <img
                src={imagePreview}
                alt="Selected"
                className="max-w-[50px] h-auto rounded-lg ml-2" // Set size for preview
              />
            </div>
          )}

          <div id="messages"></div>
        </div>
      </div>
    </div>
  );
};


export default StrangerChat;

