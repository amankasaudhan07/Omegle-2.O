import React, { memo } from "react";
import {Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Delete as DeleteIcon } from "@mui/icons-material";
import AvatarCard from "./AvtarCard";
import { useTheme } from "../layout/ThemeProvider";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
  onClick,
}) => {
  const { isDarkMode } = useTheme();
  return (
    <Link to={`/chat/${_id}`} onClick={onClick}
    // onClick={(e) => {
    //   if (chatId === _id) e.preventDefault();
    // }} 
     className="block relative">
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className={`relative flex items-center gap-3 p-3 transition-colors sm:gap-4 sm:p-4 ${
          sameSender
            ? isDarkMode
              ? "bg-slate-700 text-white"
              : "bg-slate-900 text-white"
            : isDarkMode
            ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
            : "bg-white text-slate-900 hover:bg-slate-100"
        }`}
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <AvatarCard avatar={avatar} />
        <div className="min-w-0 flex-1 pr-10">
          <h3 className="truncate text-base font-semibold sm:text-lg">{name}</h3>
          {newMessageAlert && (
            <p className="truncate text-xs font-medium text-blue-500 sm:text-sm">
              {newMessageAlert.count} New Message
              {newMessageAlert.count > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {isOnline && (
          <div className="absolute right-11 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800 sm:right-12 sm:h-3 sm:w-3" />
        )}

        {/* Delete Icon for context menu action */}
        <DeleteIcon
          className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer hover:text-red-500"
          style={{ color: "var(--muted)" }}
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            handleDeleteChat(e, _id, groupChat);
          }}
        />
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
