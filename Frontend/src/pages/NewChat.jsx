import React, { useEffect, useMemo, useState } from 'react';
import music from './mixkit-tile-game-reveal-960.wav';
import StrangerChat from './StrangerChat.jsx'
import { useSelector } from "react-redux";
import { getSocket } from '../socket.jsx';

const NewChat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [connectedUser, setConnectedUser] = useState("");
  const [partnerUser, setPartnerUser] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(0); 
  const [waitingUsers, setWaitingUsers] = useState(0); // Waiting users excluding current user
  const [isUserInWaitingList, setIsUserInWaitingList] = useState(false); // Check if current user is in waiting list
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button
  const notification = useMemo(() => new Audio(music), []);
  const [bothLoggedIn, setBothLoggedIn] = useState(false);
  const [partnerId, setPartnerId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    const handleMatched = (data) => {
      console.log("Matched event received:", data);
      setRoom(data.roomID);
      setConnectedUser(data.partnerUsername); 
      setPartnerUser(data.partnerUser)
      setBothLoggedIn(data.bothLoggedIn);   
      setPartnerId(data.partnerId);    
      setShowChat(true);
      setIsMatched(true);
      setIsLoading(false);
      notification.play();
    };
     
    const handleOnlineUsers = (count) => {
      setOnlineUsers(count);
    };

    const handleWaitingUsers = (count) => {
      setWaitingUsers(count);
    };

    socket.on("matched", handleMatched);
    socket.on("online_users", handleOnlineUsers);
    socket.on("waiting_users", handleWaitingUsers);

    return () => {
      socket.off("matched", handleMatched);
      socket.off("online_users", handleOnlineUsers);
      socket.off("waiting_users", handleWaitingUsers);
    };
  }, [notification, socket]);

  const findChatPartner = () => {
    if (username !== "") {
      console.log("Emitting find_partner event");
      socket.emit("find_partner",
        {  username,
           userId: user?._id || null  ,
           user:user || null,
        }

      );
      setIsLoading(true);
      setIsUserInWaitingList(true); // Mark the current user as in the waiting list
    }else {
      alert("Please enter a username.");
    }
  };
 
   // Go back to home page function
   const goBackToHome = () => {
    setShowChat(false);
    setIsMatched(false);
    setRoom("");
    setConnectedUser("");
    setPartnerUser(null)
    setBothLoggedIn(false);   // ✅ reset
    setPartnerId(null); 
    // setUsername(""); // Optional: clear username
    setIsUserInWaitingList(false);
  };

  return (
    <>
      {!showChat && (
        <div className="join_room flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Chat Partner</h1>
        <p className="text-lg mb-2">{onlineUsers} strangers online</p> 
        {/* Conditionally display if someone is waiting or not */}
        {waitingUsers > 0 && !isUserInWaitingList ? (
          <p className="text-green-500 mb-4">Someone is waiting to be matched!</p>
        ) : (
          <p className="text-red-500 mb-4">No one is waiting currently.</p>
        )}
        <input
          type="text"
          placeholder="Enter Your Name"
           value={username} 
          className="w-full md:w-1/2 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button 
          onClick={findChatPartner}
          className={`w-full md:w-1/2 p-3 rounded-lg text-lg font-semibold 
            ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          disabled={isLoading}
        >
          {isLoading ? "Finding Partner..." : "Find Partner"}
        </button>
      </div>
      
      )}
      {showChat && isMatched && (
        <StrangerChat socket={socket} username={username} room={room} connectedUser={connectedUser}  bothLoggedIn={bothLoggedIn}   // ✅ NEW
  partnerId={partnerId}  partner={partnerUser} goBackToHome={goBackToHome} />
       
      )}
    </>
  );
}

export default NewChat;
