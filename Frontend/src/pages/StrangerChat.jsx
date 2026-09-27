import React, { useEffect, useRef, useState } from "react";
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
import { RELATION_UPDATED, CHAT_CREATED } from "../constants/events";
import { useTheme } from "../components/layout/ThemeProvider";
import UserAvatar from "../components/shared/UserAvatar";

const StrangerChat = ({
  socket,
  username,
  room,
  connectedUser,
  bothLoggedIn,
  partnerId,
  partner,
  goBackToHome,
  onFindNew,
  isFindingNew = false,
}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const notification = new Audio(music);
  const containRef = useRef(null);
  const [relation, setRelation] = useState("none");
  const [requestId, setRequestId] = useState("");

  const [sendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

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
    }
  };

  const handleDisconnect = () => {
    goBackToHome();
  };

  const handleFindNew = () => {
    setMessageList([]);
    onFindNew();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentMessage("");
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      setMessageList((list) => [...list, data]);
    };

    const handleDisconnectNotification = () => {
      toast.error("Your partner has skipped the chat.");
      goBackToHome({ shouldCleanup: false });
    };

    socket.off("receive_message");
    socket.off("receive_image");
    socket.off("partner_disconnected");

    socket.on("receive_message", handleReceiveMsg);
    socket.on("receive_image", handleReceiveMsg);
    socket.on("partner_disconnected", handleDisconnectNotification);

    return () => {
      socket.off("receive_message", handleReceiveMsg);
      socket.off("receive_image", handleReceiveMsg);
      socket.off("partner_disconnected", handleDisconnectNotification);
    };
  }, [socket]);

  useEffect(() => {
    if (containRef.current) {
      containRef.current.scrollTop = containRef.current.scrollHeight;
    }
  }, [messageList]);

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
    await acceptRequest("Accepting...", { requestId, accept });
    if (accept) {
      setRelation("friends");
      setRequestId("");
    } else {
      setRelation("none");
      setRequestId("");
    }
  };

  const { data: relationData } = useGetRelationStatusQuery(partnerId, {
    skip: !partnerId || !bothLoggedIn,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!relationData) return;

    setRelation(relationData.status);
    setRequestId(relationData.requestId || "");
  }, [relationData]);

  useEffect(() => {
    const handleRelationUpdated = (data) => {
      if (data.partnerId && String(data.partnerId) !== String(partnerId)) {
        return;
      }
      setRelation(data.status);
      setRequestId(data.requestId || "");
    };

    const handleChatCreated = (data) => {
      console.log("chat created", data);
      // socket.emit("disconnect_chat", { room, username });
      // navigate(`/chat/${data.chatId}`);
    };

    socket.on(RELATION_UPDATED, handleRelationUpdated);
    socket.on(CHAT_CREATED, handleChatCreated);

    return () => {
      socket.off(RELATION_UPDATED, handleRelationUpdated);
      socket.off(CHAT_CREATED, handleChatCreated);
    };
  }, [socket, partnerId]);

  const pageClass = isDarkMode
    ? "min-h-[calc(100vh-4rem)] bg-[#1f2937] px-3 py-4 text-white sm:px-5 lg:px-8"
    : "min-h-[calc(100vh-4rem)] bg-[#f8fafc] px-3 py-4 text-slate-900 sm:px-5 lg:px-8";

  const shellClass = isDarkMode
    ? "overflow-hidden rounded-[28px] border border-slate-700 bg-[#111827] shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
    : "overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]";

  const dividerClass = isDarkMode
    ? "border-b border-slate-700 px-4 py-4 sm:px-6"
    : "border-b border-slate-200 px-4 py-4 sm:px-6";

  const strongTextClass = isDarkMode ? "text-white" : "text-slate-900";
  const softTextClass = isDarkMode ? "text-slate-300" : "text-slate-600";
  const mutedTextClass = isDarkMode ? "text-slate-400" : "text-slate-500";
  const partnerCardClass = isDarkMode
    ? "flex flex-col gap-4 rounded-3xl bg-slate-800 p-4 sm:flex-row sm:items-center"
    : "flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center";
  const messagesClass = isDarkMode
    ? "h-[52vh] min-h-[320px] overflow-y-auto rounded-[24px] bg-slate-900 p-3 shadow-inner shadow-black/20 sm:h-[58vh] sm:border sm:border-slate-700 sm:p-4"
    : "h-[52vh] min-h-[320px] overflow-y-auto rounded-[24px] bg-white p-3 shadow-inner shadow-slate-200 sm:h-[58vh] sm:border sm:border-slate-200 sm:p-4";
  const composerClass = isDarkMode
    ? "mt-4 rounded-[24px] bg-slate-800 p-3 sm:border sm:border-slate-700 sm:p-4"
    : "mt-4 rounded-[24px] bg-slate-50 p-3 sm:border sm:border-slate-200 sm:p-4";
  const attachClass = isDarkMode
    ? `flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-lg ${
        currentMessage.length > 0
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer transition hover:bg-slate-800"
      }`
    : `flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg ${
        currentMessage.length > 0
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer transition hover:bg-slate-100"
      }`;
  const inputClass = isDarkMode
    ? "h-12 flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-400 disabled:opacity-50"
    : "h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 disabled:opacity-50";
  const sendButtonClass = isDarkMode
    ? "h-12 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
    : "h-12 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5";
  const previewClass = isDarkMode
    ? "mt-3 flex items-center gap-3 rounded-2xl bg-slate-900 p-3"
    : "mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3";

  return (
    <div className={pageClass}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className={shellClass}>
          <div className={dividerClass}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${mutedTextClass}`}>
                  Stranger Chat
                </p>
                <h1 className={`mt-2 text-2xl font-bold sm:text-3xl ${strongTextClass}`}>
                  Hey {username}
                </h1>
                <div className={`mt-2 text-sm sm:text-base ${softTextClass}`}>
                  {isFindingNew
                    ? "Finding a new partner for you..."
                    : `You are connected with ${connectedUser}`}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDisconnect}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  End Chat
                </button>
                <button
                  onClick={handleFindNew}
                  disabled={isFindingNew}
                  className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Find New
                </button>
              </div>
            </div>
          </div>

          {partner && !isFindingNew && (
            <div className={dividerClass}>
              <div className={partnerCardClass}>
                <div className="relative mx-auto sm:mx-0">
                  <UserAvatar
                    name={partner.name || partner.username}
                    src={partner.avatar?.url}
                    className={`h-16 w-16 rounded-2xl ${
                      isDarkMode ? "border border-slate-600" : "border border-slate-200"
                    }`}
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ${
                      isDarkMode ? "border-2 border-slate-900" : "border-2 border-white"
                    }`}
                  ></span>
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h2 className={`truncate text-lg font-bold ${strongTextClass}`}>
                    {partner.username}
                  </h2>
                  <p className={`mt-1 text-sm ${softTextClass}`}>
                    {partner.bio || "No bio available"}
                  </p>
                </div>

                {bothLoggedIn && (
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                    {relation === "none" && (
                      <button
                        onClick={() => addFriendHandler(partnerId)}
                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Add Friend
                      </button>
                    )}

                    {relation === "requested" && (
                      <button
                        disabled
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          isDarkMode
                            ? "bg-slate-700 text-slate-200"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        Requested
                      </button>
                    )}

                    {relation === "pending" && (
                      <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                        <button
                          onClick={() =>
                            friendRequestHandler({ requestId, accept: true })
                          }
                          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            friendRequestHandler({ requestId, accept: false })
                          }
                          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {relation === "friends" && (
                      <button
                        disabled
                        className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Friends
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="px-3 py-3 sm:px-5 sm:py-5">
            <div className={messagesClass} ref={containRef}>
              {messageList.length === 0 && (
                <div className={`flex h-full items-center justify-center text-center text-sm ${mutedTextClass}`}>
                  {isFindingNew
                    ? "Hold on, we are looking for someone new."
                    : "Say hi and start the chat."}
                </div>
              )}

              {messageList.map((data) => (
                <div
                  key={data.id}
                  className={`mb-4 flex ${
                    username === data.author ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[85%] sm:max-w-[70%]">
                    <div
                      className={`rounded-3xl px-4 py-3 text-sm ${
                        username === data.author
                          ? isDarkMode
                            ? "rounded-br-md bg-white text-slate-900"
                            : "rounded-br-md bg-slate-900 text-white"
                          : isDarkMode
                          ? "rounded-bl-md bg-slate-700 text-slate-100"
                          : "rounded-bl-md bg-slate-100 text-slate-900"
                      }`}
                    >
                      {data.type === "text" ? (
                        <p className="break-words leading-relaxed">
                          {data.message}
                        </p>
                      ) : (
                        <img
                          src={data.image}
                          alt="sent"
                          className="max-h-64 w-full rounded-2xl object-cover"
                        />
                      )}
                    </div>
                    <p
                      className={`mt-1 px-1 text-xs ${mutedTextClass} ${
                        username === data.author ? "text-right" : "text-left"
                      }`}
                    >
                      {data.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={composerClass}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="imageInput"
                    className="hidden"
                    disabled={currentMessage.length > 0 || isFindingNew}
                    onChange={handleImageChange}
                  />

                  <label htmlFor="imageInput" className={attachClass}>
                    <MdAttachFile />
                  </label>
                </div>

                <div className="flex flex-1 items-center gap-2">
                  <input
                    value={currentMessage}
                    type="text"
                    placeholder="Type a message..."
                    disabled={!!image || isFindingNew}
                    className={inputClass}
                    onChange={(e) => {
                      setImage(null);
                      setImagePreview(null);
                      setCurrentMessage(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />

                  <button
                    onClick={sendMessage}
                    disabled={isFindingNew || (!image && !currentMessage.trim())}
                    className={sendButtonClass}
                  >
                    Send
                  </button>
                </div>
              </div>

              {imagePreview && (
                <div className={previewClass}>
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className={`flex-1 text-sm ${softTextClass}`}>
                    Image ready to send
                  </div>
                  <button
                    onClick={removeImage}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
                  >
                    <IoClose />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrangerChat;
