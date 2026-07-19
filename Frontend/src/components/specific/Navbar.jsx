import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { userNotExists } from '../../redux/reducers/auth';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../constants/config';
import logo from '../../assets/logo.jpg';
import { useTheme } from '../layout/ThemeProvider';



const Navbar = () => {
    const {user, loader } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
   const { isDarkMode, toggleTheme } = useTheme();
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
    <nav
      className="w-full border-b"
      style={{
        backgroundColor: isDarkMode ? "#111827" : "var(--surface)",
        color: isDarkMode ? "#f8fafc" : "var(--text)",
        borderColor: isDarkMode ? "#1f2937" : "var(--border)",
      }}
    >
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
            <Link to="/" className="transition hover:opacity-70">Home</Link>
            <Link to="/about" className="transition hover:opacity-70">About</Link>
            <Link to="/support" className="transition hover:opacity-70">Support</Link>
          </div>

          {/* Right: Authentication Links */}
         <div className="hidden md:flex items-center relative" ref={profileRef}>
            <button
              onClick={toggleTheme}
              className="rounded-full px-4 py-2 text-sm font-semibold border transition"
              style={{
                backgroundColor: "var(--surface-soft)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              {isDarkMode ? "Light" : "Dark"}
            </button>
            {user ? (
              <>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="ml-4 flex items-center rounded-full transition"
                  style={{ backgroundColor: "var(--surface-soft)" }}
                >
                  <img
                    src={user.avatar?.url || "/default.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                    style={{ border: "1px solid var(--border)" }}
                  />
                 
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 top-16 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl"
                    style={{
                      backgroundColor: "var(--surface)",
                      color: "var(--text)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="p-5" style={{ backgroundColor: "var(--accent)", color: isDarkMode ? "#111827" : "#ffffff" }}>
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
                        <p className="text-xs uppercase tracking-wide app-muted">Bio</p>
                        <p className="mt-1 text-sm">
                          {user.bio || "No bio added yet"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide app-muted">Joined At</p>
                        <p className="mt-1 text-sm">
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
              <Link to="/login" className="ml-6 transition hover:opacity-70">Login</Link>
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
        <div className="md:hidden" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={toggleTheme}
              className="block w-full rounded-xl px-3 py-2 text-left text-base font-medium"
              style={{ backgroundColor: "var(--surface-soft)" }}
            >
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
        
            {user ? (
              <>
                <div className="px-3 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
                  <img
                    src={user.avatar?.url || "/default.png"}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: "1px solid var(--border)" }}
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm app-muted">@{user.username}</p>
                    <p className="text-xs app-muted">{user.bio || "No bio added yet"}</p>
                  </div>
                </div>

                
              </>
            ) : (

              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>Login</Link>
               
              </>
            )}
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>Home</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>About</Link>
            <Link to="/support" className="block px-3 py-2 rounded-md text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>Support</Link>
            <button
                  onClick={() => {
                    logoutHandler();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  style={{ backgroundColor: "#ef4444", color: "white" }}
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
