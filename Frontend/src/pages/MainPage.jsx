import React from 'react';
import { useNavigate } from 'react-router-dom';
import Img from '../assets/img3.png';
import Navbar from '../components/specific/Navbar';
import Footer from './Footer';
import { useTheme } from '../components/layout/ThemeProvider';

const MainPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen flex flex-col-reverse items-center justify-center px-6 py-12 md:flex-row md:justify-between md:px-24"
         style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <div className="mb-8 text-center md:mb-0 md:w-1/2 md:text-left">
          <h1 className="text-4xl font-bold md:text-6xl">Talk to Strangers,</h1>
          <h2 className="mt-4 text-2xl font-semibold md:text-4xl">Make friends!</h2>
          <p className="mt-4 text-xl md:text-2xl app-muted">
            Unlock a world of connections, discover new friendships, and engage
            with strangers across the globe like never before.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              className="rounded-2xl px-6 py-3 text-lg text-white shadow-md transition"
              style={{ backgroundColor: "var(--brand)" }}
              onClick={() => {
                navigate('/newChat');
              }}
            >
              Chat With Strangers
            </button>
            <button
              className="rounded-2xl px-6 py-3 text-lg text-white shadow-md transition"
              style={{ backgroundColor: isDarkMode ? "#374151" : "#0f172a" }}
              onClick={() => {
                navigate('/friends');
              }}
            >
              Chat With Your Friends
            </button>
          </div>
        </div>

        <div className="">
          <img
            src={Img}
            alt="Talk to strangers"
            // className="w-full max-w-md rounded-[28px] shadow-lg md:ml-20"
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MainPage;
