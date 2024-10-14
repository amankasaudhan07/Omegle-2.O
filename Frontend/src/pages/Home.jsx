import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <div className="bg-gray-800 h-screen flex items-center justify-center">
      <h5 className="text-white text-2xl p-8 text-center">
        Select a friend to chat
      </h5>
    </div>
  );
};

// Correctly wrap Home with AppLayout HOC
export default AppLayout(Home);

