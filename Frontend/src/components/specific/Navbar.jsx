import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
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
   const [profileOpen, setProfileOpen] = useState(false);
   const profileRef = useRef(null);

 

  const navigate = useNavigate();

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const logoutHandler = async () => {
      try {
          const { data } = await axios.get(`${server}/api/v1/user/logout`, {
              withCredentials: true,
            });
           

      dispatch(userNotExists());
       setProfileOpen(false);
      toast.success(data.message);
       navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



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
         <div className="hidden md:flex items-center relative" ref={profileRef}>
            {user ? (
              <>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="ml-6 flex items-center  bg-gray-800 hover:bg-gray-700  rounded-full transition"
                >
                  <img
                    src={user.avatar?.url || "/default.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-600"
                  />
                 
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-16 w-80 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="bg-gray-900 text-white p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar?.url || "/default.png"}
                          alt="profile"
                          className="w-16 h-16 rounded-full object-cover border-2 border-white"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-300">@{user.username}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Bio</p>
                        <p className="mt-1 text-sm text-gray-700">
                          {user.bio || "No bio added yet"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Joined At</p>
                        <p className="mt-1 text-sm text-gray-700">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Not available"}
                        </p>
                      </div>


                      <button
                        onClick={logoutHandler}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="ml-6 hover:text-yellow-400">Login</Link>
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
        
            {user ? (
              <>
                <div className="px-3 py-3 border-b border-gray-700 flex items-center gap-3">
                  <img
                    src={user.avatar?.url || "/default.png"}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-600"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-300">@{user.username}</p>
                    <p className="text-xs text-gray-400">{user.bio || "No bio added yet"}</p>
                  </div>
                </div>

                
              </>
            ) : (

              <>
                <Link to="/login" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Login</Link>
               
              </>
            )}
            <Link to="/" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/about" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">About</Link>
            <Link to="/support" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">Support</Link>
            <button
                  onClick={() => {
                    logoutHandler();
                  }}
                  className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium text-white"
                >
                  Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
