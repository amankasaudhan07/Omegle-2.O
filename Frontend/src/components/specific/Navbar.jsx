import React, { useContext, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// import logo from './assets/logo-color.png';
import { userNotExists } from '../../redux/reducers/auth';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../constants/config';
import logo from '../../assets/logo.jpg';



const Navbar = () => {
    const {user, loader } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
  const [navOpen, setNavOpen] = useState(false);
 

  const navigate = useNavigate();

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const logoutHandler = async () => {
      try {
          const { data } = await axios.get(`${server}/api/v1/user/logout`, {
              withCredentials: true,
            });
            console.log("aman");

      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };


  return (
    <nav className="w-full bg-gray-900 dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo / Icon */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-44 " // Adjust the height as needed
            />
          </div>
          {/* Center: Menu */}
          <div className="hidden md:flex space-x-8 items-center justify-center flex-grow">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/about" className="hover:text-yellow-400">About</Link>
            <Link to="/support" className="hover:text-yellow-400">Support</Link>
          </div>

          {/* Right: Authentication Links */}
          <div className="hidden md:flex items-center">
            {user ? (
              // Show Logout button when authenticated
              <button
                onClick={() => {
                 logoutHandler()
                //   navigate('/')
                }
                }
                className="ml-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              // Show Login and Register buttons when not authenticated
              <>
                <Link to="/login" className="ml-6 hover:text-yellow-400">Login</Link>
            
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={handleNavToggle}>
              {navOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {navOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/about" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">About</Link>
            <Link to="/support" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Support</Link>
            {user ? (
              <button
                onClick={() => {
                  logoutHandler()
                //   navigate('/')
                }
                }
                className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Login</Link>
               
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
