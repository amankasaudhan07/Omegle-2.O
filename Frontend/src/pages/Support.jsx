import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from '../components/specific/Navbar';
import { useTheme } from '../components/layout/ThemeProvider';

const Support = () => {
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
            Support & Help Center
          </h2>
          <p className="mb-12 text-center text-lg leading-relaxed md:text-xl lg:text-2xl app-muted">
            We're here to help you with any questions or issues you may have.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[24px] border p-6 shadow-lg" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h3>
              <p className="mb-4 text-md leading-relaxed app-muted">
                Browse our FAQ section to find answers to common questions about chat, safety tips, and more.
              </p>
              <Link to="/faq" className="font-semibold" style={{ color: "var(--brand)" }}>Go to FAQ</Link>
            </div>

            <div className="rounded-[24px] border p-6 shadow-lg" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="mb-4 text-xl font-semibold">Report an Issue</h3>
              <p className="mb-4 text-md leading-relaxed app-muted">
                Encountering a bug or issue while chatting? Let us know and we’ll work to resolve it as soon as possible.
              </p>
              <Link to="/report-issue" className="font-semibold" style={{ color: "var(--brand)" }}>Report a Problem</Link>
            </div>

            <div className="rounded-[24px] border p-6 shadow-lg" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="mb-4 text-xl font-semibold">Contact Support</h3>
              <p className="mb-4 text-md leading-relaxed app-muted">
                Need more help? Get in touch with our support team for personal assistance.
              </p>
              <Link to="/contact" className="font-semibold" style={{ color: "var(--brand)" }}>Contact Us</Link>
            </div>
          </div>

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
      </section>

      <Footer />
    </>
  );
};

export default Support;
