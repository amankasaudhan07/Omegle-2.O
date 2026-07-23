import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useTheme } from "../layout/ThemeProvider";

const ReportIssue = () => {
  const navigate = useNavigate();

  // Keeps component in sync with theme changes
  useTheme();

  const [form, setForm] = useState({
    email: "",
    issue: "",
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Your issue has been reported!");
    console.log("Issue reported:", form);

    navigate("/support");
  };

  return (
    <>
      <Navbar />
         
      <section
        className="min-h-screen py-14 transition-all duration-300"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        }}
      >
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ color: "var(--text)" }}
            >
              Report an Issue
            </h2>

            <p
              className="text-lg"
              style={{
                color: "var(--text)",
                opacity: 0.75,
              }}
            >
              Tell us what's wrong and we'll get back to you as soon as
              possible.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto p-8 md:p-10 rounded-2xl shadow-xl transition-all duration-300"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Email */}
            <div className="mb-7">
              <label
                htmlFor="email"
                className="block font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Your Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>

            {/* Issue */}
            <div className="mb-8">
              <label
                htmlFor="issue"
                className="block font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Issue Description
              </label>

              <textarea
                id="issue"
                name="issue"
                rows="7"
                value={form.issue}
                onChange={handleInputChange}
                placeholder="Describe your issue..."
                required
                className="w-full px-4 py-3 rounded-xl resize-none outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
              style={{
                background:
                  "linear-gradient(to right, #ef4444, #dc2626)",
              }}
            >
              Submit Issue
            </button>
          </form>
        </div>
      </section>

      {/* Component-specific styles */}
      <style>{`
        input,
        textarea {
          color: var(--text);
          background: var(--bg);
          border: 1px solid var(--border);
        }

        input::placeholder,
        textarea::placeholder {
          color: var(--text);
          opacity: 0.55;
        }

        input:focus,
        textarea:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
        }
      `}</style>
    </>
  );
};

export default ReportIssue;