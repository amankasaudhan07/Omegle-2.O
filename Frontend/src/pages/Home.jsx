import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <h5 className="text-2xl p-8 text-center app-muted">
        Select a friend to chat
      </h5>
    </div>
  );
};

export default AppLayout(Home);
