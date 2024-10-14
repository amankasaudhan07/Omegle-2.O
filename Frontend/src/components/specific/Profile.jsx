import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";

const Profile = ({ user }) => {
  return (
    <div className="flex flex-col items-center space-y-8 md:space-y-6 px-4 md:px-0">
      <Avatar
        src={transformImage(user?.avatar?.url)}
        alt="Avatar"
        sx={{
          width: { xs: 120, sm: 150, md: 200 }, // Responsive size
          height: { xs: 120, sm: 150, md: 200 },
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading="Bio" text={user?.bio} />
      <ProfileCard heading="Username" text={user?.username} Icon={<UserNameIcon fontSize="large" />} />
      <ProfileCard heading="Name" text={user?.name} Icon={<FaceIcon fontSize="large" />} />
      <ProfileCard heading="Joined" text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon fontSize="large" />} />
    </div>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <div className="flex items-center space-x-4 text-center text-white">
    {Icon && <div className="text-3xl">{Icon}</div>}
    <div>
      <p className="text-sm md:text-base">{text}</p>
      <p className="text-gray-400 text-xs md:text-sm">{heading}</p>
    </div>
  </div>
);

export default Profile;
