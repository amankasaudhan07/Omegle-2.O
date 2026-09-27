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
import { useTheme } from "../components/layout/ThemeProvider";
import UserAvatar from "../components/shared/UserAvatar";

const EMPTY_MEMBERS = [];



const Chat = ({ chatId, user, onlineUsers = [] }) => {
  // const { user } = useSelector((state) => state.auth);
  
  // console.log("user",user);
  // console.log("chatid",chatId);

  const socket = getSocket();

  // console.log("socket",socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, populate: true, skip: !chatId });
  

  
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
  const chat = chatDetails?.data?.chat;
  const members = chat?.members || EMPTY_MEMBERS;
  const memberIds = useMemo(
    () => members.map((member) => member?._id ?? member),
    [members]
  );
  const otherMember = chat?.groupChat
    ? null
    : members.find((member) => String(member?._id) !== String(user?._id));
  const conversationName = chat?.groupChat
    ? chat?.name
    : otherMember?.name;
  const isOtherMemberOnline = otherMember
    ? onlineUsers.some((onlineUser) => String(onlineUser?._id ?? onlineUser) === String(otherMember._id))
    : false;
//   console.log("members ->", members);
// console.log("members type ->", Array.isArray(members));
// console.log("first member ->", members?.[0]);
// console.log("first member typeof ->", typeof members?.[0]);
  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      // socket.emit(START_TYPING, { members, chatId });
      socket.emit(START_TYPING, {
        members: memberIds,
        chatId,
        userId: user._id,
        name: user.name,
      });

      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      // socket.emit(STOP_TYPING, { members, chatId });
      socket.emit(STOP_TYPING, {
        members: memberIds,
        chatId,
        userId: user._id,
      });

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
    socket.emit(NEW_MESSAGE, { chatId, members: memberIds, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members: memberIds });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      socket.emit(CHAT_LEAVED, { userId: user._id, members: memberIds });
    };
  }, [chatId, user._id, memberIds, dispatch, socket]);

  useEffect(() => {
  setMessages([]);        // clear real-time messages
  setOldMessages([]);     // clear old paginated messages
  setPage(1);             // reset pagination
  setTypingUsers([]);

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

  setTypingUsers((prev) => {
    const exists = prev.some((item) => item.userId === data.userId);
    if (exists) return prev;

    return [...prev, { userId: data.userId, name: data.name }];
  });
}, [chatId]);

const stopTypingListener = useCallback((data) => {
  if (data.chatId !== chatId) return;

  setTypingUsers((prev) =>
    prev.filter((item) => item.userId !== data.userId)
  );
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
      <div className="flex h-full min-h-0 min-w-0 flex-col gap-2 app-shell sm:gap-3">
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-2 sm:px-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="relative h-10 w-10 shrink-0 sm:h-11 sm:w-11">
            <UserAvatar
              name={conversationName}
              src={otherMember?.avatar}
              className="h-full w-full text-sm"
            />
            {!chat?.groupChat && (
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 ${isOtherMemberOnline ? "border-white bg-emerald-500" : "border-white bg-slate-400"}`} aria-label={isOtherMemberOnline ? "Online" : "Offline"} />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>{conversationName || "Conversation"}</p>
            <p className="flex items-center gap-1.5 text-xs app-muted">
              {!chat?.groupChat && <span className={`h-1.5 w-1.5 rounded-full ${isOtherMemberOnline ? "bg-emerald-500" : "bg-slate-400"}`} />}
              {chat?.groupChat ? `${members.length} members` : isOtherMemberOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div
          ref={containerRef}
          className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl p-2 sm:p-4"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))}
          {/* {userTyping && <TypingLoader />} */}
          {typingUsers.length > 0 && (
            <p className="px-2 text-sm app-muted">
              {typingUsers.length === 1
                ? `${typingUsers[0].name} is typing...`
                : `${typingUsers.map((u) => u.name).join(", ")} are typing...`}
            </p>
          )}

          <div ref={bottomRef} />
        </div>
        <form
          className="flex shrink-0 items-center gap-1 rounded-2xl p-2 sm:gap-2 sm:p-3"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
          onSubmit={submitHandler}
        >
          <IconButton size="small" aria-label="Attach file" className="shrink-0 text-gray-500" onClick={handleFileOpen}>
            <AttachFileIcon />
          </IconButton>
          <input
            type="text"
            className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none sm:text-base"
            style={{
              backgroundColor: "var(--surface-soft)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            placeholder="Type a message..."
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            size="small"
            aria-label="Send message"
            type="submit"
            className="shrink-0 rounded-full p-2"
            style={{ backgroundColor: isDarkMode ? "#ffffff" : "#0f172a", color: isDarkMode ? "#0f172a" : "#ffffff" }}
          >
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




//  this code is only related to chats b/w users 
