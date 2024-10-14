import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ReportIssue = () => {
   const navigate =useNavigate();
  const [form, setForm] = useState({ email: '', issue: '' });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    toast.success('Your Issue is reported')
    // Handle issue submission logic (e.g., send report to the backend)
    console.log('Issue reported:', form);
    navigate('/support');
  };

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-12">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Report an Issue</h2>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Your Email</label>
            <input 
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border  text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="issue" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Issue Description</label>
            <textarea 
              name="issue"
              value={form.issue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border  text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              required
            ></textarea>
          </div>
          <button 
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReportIssue;
