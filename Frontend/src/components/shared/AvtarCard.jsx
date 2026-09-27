import React from "react";
import { transformImage } from "../../lib/features";
import UserAvatar from "./UserAvatar";

const AvatarCard = ({ avatar = [], max = 4, fallbackText = "" }) => {
  const avatars = (Array.isArray(avatar) ? avatar : []).filter(Boolean);
  const displayAvatars = avatars.slice(0, max);
  const remainingAvatars = avatars.length - max;

  return (
    <div className="relative h-10 w-12 shrink-0 sm:h-12 sm:w-16">
      {displayAvatars.length === 0 && (
        <UserAvatar name={fallbackText} className="h-10 w-10 sm:h-12 sm:w-12" />
      )}
      {displayAvatars.map((avatarSrc, index) => (
        <img
          key={`${avatarSrc}-${index}`}
          src={transformImage(avatarSrc)}
          alt={`Avatar ${index + 1}`}
          className="absolute left-0 top-0 h-10 w-10 rounded-full border-2 border-white object-cover sm:h-12 sm:w-12"
          style={{ left: `${index * 9}px`, zIndex: displayAvatars.length - index }}
        />
      ))}
      {remainingAvatars > 0 && (
        <div className="absolute left-7 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-semibold text-slate-800 sm:left-9 sm:h-12 sm:w-12 sm:text-sm">
          +{remainingAvatars}
        </div>
      )}
    </div>
  );
};

export default AvatarCard;
