import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/specific/Navbar';
import Footer from './Footer';
import { useTheme } from '../components/layout/ThemeProvider';

const About = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <>
      <Navbar />

      <section
        className="min-h-screen py-12"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            About Our Chat Platform
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex justify-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXX_WN-5ur-MBoGOFxVprs5dpltBVMgeR3-g&s"
                alt="Chat Illustration"
                className="w-full rounded-[28px] shadow-lg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="mb-6 text-lg leading-relaxed md:text-xl lg:text-2xl app-muted">
                Our platform offers the best of both worlds: connect with strangers randomly or build lasting friendships.
              </p>
              <p className="mb-6 text-lg leading-relaxed md:text-xl lg:text-2xl app-muted">
                Whether you're exploring random conversations or reconnecting with friends, you can chat, create groups, and stay in touch with people from all over the world.
              </p>
              <p className="mb-6 text-lg leading-relaxed md:text-xl lg:text-2xl app-muted">
                Enjoy a safe and interactive experience. Start a chat, share moments, and explore limitless connections.
              </p>
              <div>
                <button
                  className="mt-8 rounded-2xl px-6 py-3 text-lg text-white shadow-md transition"
                  style={{ backgroundColor: "var(--brand)" }}
                  onClick={() => { navigate('/newChat') }}
                >
                  Chat With Strangers
                </button>
                <button
                  className="ml-4 mt-8 rounded-2xl px-6 py-3 text-lg text-white shadow-md transition"
                  style={{ backgroundColor: isDarkMode ? "#374151" : "#0f172a" }}
                  onClick={() => { navigate('/friends') }}
                >
                  Chat With Your Friends
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
