import React, { useState } from "react";

const UserAvatar = ({ name = "", src, className = "", alt }) => {
  const imageUrl = typeof src === "string" ? src : src?.url;
  const [failedSource, setFailedSource] = useState("");
  const imageFailed = failedSource === imageUrl;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return imageUrl && !imageFailed ? (
    <img
      src={imageUrl}
      alt={alt || `${name}'s profile`}
      className={`rounded-full object-cover ${className}`}
      onError={() => setFailedSource(imageUrl)}
    />
  ) : (
    <span
      role="img"
      aria-label={alt || `${name || "User"}'s profile`}
      className={`inline-flex items-center justify-center rounded-full bg-[var(--brand)] font-semibold text-white ${className}`}
    >
      {initial}
    </span>
  );
};

export default UserAvatar;
