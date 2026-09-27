import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import AvatarUpload from "../shared/AvatarUpload";

const Profile = ({ user }) => {
  return (
    <div
      className="flex flex-col items-center space-y-8 md:space-y-6 px-4 md:px-0 transition-all duration-300"
      style={{ color: "var(--text)" }}
    >
      <AvatarUpload user={user} className="h-28 w-28 border-4 border-[var(--border)] shadow-lg sm:h-36 sm:w-36 md:h-48 md:w-48" />

      <ProfileCard heading="Bio" text={user?.bio || "No bio added"} />

      <ProfileCard
        heading="Username"
        text={user?.username}
        Icon={<UserNameIcon fontSize="large" />}
      />

      <ProfileCard
        heading="Name"
        text={user?.name}
        Icon={<FaceIcon fontSize="large" />}
      />

      <ProfileCard
        heading="Joined"
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon fontSize="large" />}
      />
    </div>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <div
    className="w-full max-w-sm rounded-xl px-4 py-2 flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
    style={{
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
    }}
  >
    {Icon && (
      <div
        className="text-3xl"
        style={{ color: "var(--text)" }}
      >
        {Icon}
      </div>
    )}

    <div>
      <p
        className="text-base font-medium"
        style={{ color: "var(--text)" }}
      >
        {text}
      </p>

      <p
        className="text-sm"
        style={{
          color: "var(--text)",
          opacity: 0.65,
        }}
      >
        {heading}
      </p>
    </div>
  </div>
);

export default Profile;
