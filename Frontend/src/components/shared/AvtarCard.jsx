import React from "react";
import { transformImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  const displayAvatars = avatar.slice(0, max);
  const remainingAvatars = avatar.length - max;

  return (
    <div className="relative h-12 w-20">
      {displayAvatars.map((avatarSrc, index) => (
        <img
          key={Math.random() * 100}
          src={transformImage(avatarSrc)}
          alt={`Avatar ${index + 1}`}
          className={`absolute w-12 h-12 rounded-full border-2 border-white ${
            index === 0 ? 'left-0' : `left-${index * 3} sm:left-${index * 4}`
          }`}
        />
      ))}
      {remainingAvatars > 0 && (
        <div className="absolute w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-800 left-9 sm:left-12">
          +{remainingAvatars}
        </div>
      )}
    </div>
  );
};

export default AvatarCard;