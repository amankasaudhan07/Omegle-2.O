import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-6xl text-white font-bold mb-4">404</h1>
        <h2 className="text-2xl text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button
          onClick={goHome}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
