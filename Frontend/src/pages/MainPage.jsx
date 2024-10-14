import React from 'react';
import { useNavigate } from 'react-router-dom';
import Img from '../assets/img3.jpg';
import Navbar from '../components/specific/Navbar';
import Footer from './Footer';


const MainPage = () => {
    const navigate = useNavigate();
    
    return (
        <>
         <Navbar/>
    
    <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center md:justify-between bg-gray-100 dark:bg-gray-900 px-6 md:px-24 py-12">
      
      {/* Left Section */}
      <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Talk to strangers,
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 dark:text-gray-300 mt-4">
          Make friends!
        </h2>
        <button 
          className="mt-8 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out"
          onClick={() => { navigate('/newChat') }}
        >
          Chat With Strangers 
        </button>
        <button 
          className="mt-8 ml-4 px-6 py-3 text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out"
          onClick={() => { navigate('/friends') }}
        >
         Chat With Your Friends 
        </button>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2">
        <img 
          src={Img} 
          alt="Talk to strangers" 
          className="w-3/4 h-1/6 rounded-lg shadow-lg ml-20"
        />
      </div>
    </div>
       <Footer/>
    </>
  );
};

export default MainPage;
