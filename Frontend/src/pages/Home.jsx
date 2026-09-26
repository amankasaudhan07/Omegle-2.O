import React from "react";
import { MessageCircle } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <div
      className="flex h-full min-h-0 items-center justify-center px-5"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl shadow-sm sm:h-20 sm:w-20" style={{ backgroundColor: "var(--surface)", color: "var(--brand)" }}>
          <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
        </div>
        <h5 className="text-xl font-semibold sm:text-2xl">Select a friend to chat</h5>
        <p className="mt-2 text-sm app-muted">Choose a conversation from your chat list to get started.</p>
      </div>
    </div>
  );
};

export default AppLayout(Home);
