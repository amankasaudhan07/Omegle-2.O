import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton } from "@mui/material";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { useNavigate } from "react-router-dom";
import { TypingLoader } from "../components/layout/Loader";
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events";



const Chat = ({ chatId ,user}) => {
  // const { user } = useSelector((state) => state.auth);
  
  // console.log("user",user);
  // console.log("chatid",chatId);

  const socket = getSocket();

  // console.log("socket",socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  

  
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );


  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  
  // console.log("aman",chatDetails);
  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(true);
  }, [chatId]);

  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(false);
  }, [chatId]);

  useSocketEvents(socket, {
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  });

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];
  
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment >
      <div className="flex flex-col h-full ">
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg">
          {allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))}
          {userTyping && <TypingLoader />}
          <div ref={bottomRef} />
        </div>
        <form className="flex items-center p-4 bg-white shadow-md" onSubmit={submitHandler}>
          <IconButton className="text-gray-500" onClick={handleFileOpen}>
            <AttachFileIcon />
          </IconButton>
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg mx-2 focus:outline-none focus:border-orange-500"
            placeholder="Type a message..."
            value={message}
            onChange={messageOnChange}
          />
          <IconButton type="submit" className="bg-orange-500 text-white hover:bg-orange-600 rounded-full p-2">
            <SendIcon />
          </IconButton>
        </form>
        <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
      </div>
      {/* </div> */}
    </Fragment>
  );
};

export default AppLayout(Chat);
