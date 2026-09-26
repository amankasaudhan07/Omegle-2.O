import React, { memo } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <div
      initial={{ opacity: 0, x: sameSender ? "100%" : "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`flex w-full min-w-0 flex-col ${
        sameSender ? "items-end" : "items-start"
      } overflow-x-hidden px-1 py-1.5 sm:p-2`}
    >
      {!sameSender && (
        <p className="text-lightBlue-500 font-semibold text-sm">
          {sender.name}
        </p>
      )}

      <div
        className={`max-w-[88%] break-words [overflow-wrap:anywhere] sm:max-w-md lg:max-w-lg ${
          attachments.length > 0
            ? ""
            : sameSender
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        } rounded-lg px-4 py-2`}
      >
        {content && <p className="text-sm">{content}</p>}

        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);

            return (
              <div key={index} className="mt-2">
                <a
                  href={url}
                  target="_blank"
                  download
                  className="text-blue-600 underline"
                >
                  {RenderAttachment(file, url)}
                </a>
              </div>
            );
          })}
      </div>

      <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
    </div>
  );
};

export default memo(MessageComponent);
