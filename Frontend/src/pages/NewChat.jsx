import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import music from './mixkit-tile-game-reveal-960.wav';
import StrangerChat from './StrangerChat.jsx'
import { useSelector } from "react-redux";
import { getSocket } from '../socket.jsx';
import { useTheme } from '../components/layout/ThemeProvider.jsx';
import Navbar from '../components/specific/Navbar.jsx';

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
  const [isFindingNew, setIsFindingNew] = useState(false);
  const roomRef = useRef("");
  const usernameRef = useRef("");
  const isFindingNewRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isUserInWaitingListRef = useRef(false);

  const { user } = useSelector((state) => state.auth);
  const socket = getSocket();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    roomRef.current = room;
    usernameRef.current = username;
    isFindingNewRef.current = isFindingNew;
    isLoadingRef.current = isLoading;
    isUserInWaitingListRef.current = isUserInWaitingList;
  }, [room, username, isFindingNew, isLoading, isUserInWaitingList]);

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
      setIsUserInWaitingList(false);
      setIsFindingNew(false);
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

  const cleanupStrangerSession = useCallback(() => {
    if (!socket) return;

    const activeRoom = roomRef.current;
    const activeUsername = usernameRef.current;

    if (activeRoom) {
      socket.emit("disconnect_chat", { room: activeRoom, username: activeUsername });
      return;
    }

    if (isFindingNewRef.current || isLoadingRef.current || isUserInWaitingListRef.current) {
      socket.emit("cancel_find_partner", { username: activeUsername });
    }
  }, [socket]);

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

  const findNewStranger = () => {
    if (!room) return;

    cleanupStrangerSession();

    setRoom("");
    setConnectedUser("");
    setPartnerUser(null);
    setBothLoggedIn(false);
    setPartnerId(null);
    setIsUserInWaitingList(true);
    setIsFindingNew(true);

    socket.emit("find_partner", {
      username,
      userId: user?._id || null,
      user: user || null,
    });
  };
 
   // Go back to home page function
  const goBackToHome = ({ shouldCleanup = true } = {}) => {
    if (shouldCleanup) {
      cleanupStrangerSession();
    }

    setShowChat(false);
    setIsMatched(false);
    setRoom("");
    setConnectedUser("");
    setPartnerUser(null)
    setBothLoggedIn(false);
    setPartnerId(null); 
    setIsFindingNew(false);
    // setUsername(""); // Optional: clear username
    setIsUserInWaitingList(false);
  };

  useEffect(() => {
    if (!socket) return;

    const handleWindowLeave = () => {
      cleanupStrangerSession();
    };

    window.addEventListener("beforeunload", handleWindowLeave);
    window.addEventListener("pagehide", handleWindowLeave);

    return () => {
      handleWindowLeave();
      window.removeEventListener("beforeunload", handleWindowLeave);
      window.removeEventListener("pagehide", handleWindowLeave);
    };
  }, [cleanupStrangerSession, socket]);

  const pageClass = isDarkMode
    ? "join_room flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[#1f2937] px-6 text-white"
    : "join_room flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[#f8fafc] px-6 text-slate-900";

  const cardClass = isDarkMode
    ? "w-full max-w-2xl rounded-[28px] border border-slate-700 bg-[#111827] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
    : "w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]";

  const inputClass = isDarkMode
    ? "w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
    : "w-full rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400";

  return (
    <>
      {!showChat && <Navbar />}
      {!showChat && (
        <div className={pageClass}>
          <div className={cardClass}>
            <div>
              <div>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Stranger Chat
                </p>
                <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                  Find Your Chat Partner
                </h1>
                <p className={`mt-2 text-base ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {onlineUsers} strangers online
                </p>
              </div>
            </div>

            <div className="mt-6">
              {waitingUsers > 0 && !isUserInWaitingList ? (
                <p className="mb-4 text-emerald-500">Someone is waiting to be matched!</p>
              ) : (
                <p className={`mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  No one is waiting currently.
                </p>
              )}

              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                className={inputClass}
                onChange={(e) => setUsername(e.target.value)}
              />

              <button
                onClick={findChatPartner}
                className={`mt-4 w-full rounded-2xl p-3 text-lg font-semibold transition ${
                  isLoading
                    ? "cursor-not-allowed bg-slate-400 text-white"
                    : isDarkMode
                    ? "bg-white text-slate-900 hover:bg-slate-200"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Finding Partner..." : "Find Partner"}
              </button>
            </div>
          </div>
        </div>
      
      )}
      {showChat && (isMatched || isFindingNew) && (
        <StrangerChat socket={socket} username={username} room={room} connectedUser={connectedUser}  bothLoggedIn={bothLoggedIn} partnerId={partnerId}  partner={partnerUser} goBackToHome={goBackToHome} onFindNew={findNewStranger} isFindingNew={isFindingNew} />
       
      )}
    </>
  );
}

export default NewChat;
