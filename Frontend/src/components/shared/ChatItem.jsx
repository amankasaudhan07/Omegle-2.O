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
}) => {
  const { isDarkMode } = useTheme();
  return (
    <Link to={`/chat/${_id}`}  
    // onClick={(e) => {
    //   if (chatId === _id) e.preventDefault();
    // }} 
     className="block relative">
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className={`flex items-center gap-4 p-4 relative transition-colors ${
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
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{name}</h3>
          {newMessageAlert && (
            <p className="text-sm font-medium text-blue-500">
              {newMessageAlert.count} New Message
              {newMessageAlert.count > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {isOnline && (
          <div className="absolute top-1/2 right-12 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full" />
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
