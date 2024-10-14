import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [secretKey, setSecretKey] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating getAdmin() call
    const checkAdminStatus = async () => {
      // Replace this with actual API call
      const adminStatus = await new Promise(resolve => setTimeout(() => resolve(false), 1000));
      setIsAdmin(adminStatus);
    };
    checkAdminStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulating adminLogin() call
    // Replace this with actual API call
    const loginSuccess = await new Promise(resolve => setTimeout(() => resolve(true), 1000));
    if (loginSuccess) {
      setIsAdmin(true);
    }
  };

  if (isAdmin) {
    navigate('/admin/dashboard');
    // return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
              Secret Key
            </label>
            <input
              id="secretKey"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;