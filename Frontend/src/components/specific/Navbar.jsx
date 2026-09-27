import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { userNotExists } from '../../redux/reducers/auth';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../constants/config';
import logo from '../../assets/logo.png';
import { useTheme } from '../layout/ThemeProvider';
import AvatarUpload from '../shared/AvatarUpload';
import UserAvatar from '../shared/UserAvatar';



const Navbar = () => {
    const {user, loader } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
   const { isDarkMode, toggleTheme } = useTheme();
   const [navOpen, setNavOpen] = useState(false);
   const [profileOpen, setProfileOpen] = useState(false);
   const profileRef = useRef(null);

 

  const navigate = useNavigate();

  const handleNavToggle = () => setNavOpen((open) => !open);

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
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: isDarkMode ? "#111827" : "var(--surface)",
        color: isDarkMode ? "#f8fafc" : "var(--text)",
        borderColor: isDarkMode ? "#1f2937" : "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Logo / Icon */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-36 object-contain sm:h-14 sm:w-40"
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
                  <UserAvatar name={user.name} src={user.avatar} className="h-10 w-10 border" />
                 
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
                        <AvatarUpload user={user} className="h-16 w-16 border-2 border-white" />
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
        <div className="absolute inset-x-0 top-full z-50 border-b shadow-xl md:hidden" style={{ backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-1 px-2 py-3 sm:px-3">
            <Link to="/" onClick={() => setNavOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>Home</Link>
            <Link to="/about" onClick={() => setNavOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>About</Link>
            <Link to="/support" onClick={() => setNavOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>Support</Link>
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "var(--surface-soft)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              <span className="flex items-center gap-3">
                {isDarkMode ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
              <span
                aria-hidden="true"
                className={`relative h-6 w-11 rounded-full transition-colors ${isDarkMode ? "bg-indigo-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isDarkMode ? "translate-x-5" : "translate-x-0.5"}`} />
              </span>
            </button>
        
            {user && (
                <div className="px-3 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
                  <AvatarUpload user={user} className="h-12 w-12 border" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm app-muted">@{user.username}</p>
                    <p className="text-xs app-muted">{user.bio || "No bio added yet"}</p>
                  </div>
                </div>
            )}
            {user ? (
              <button
                onClick={() => { setNavOpen(false); logoutHandler(); }}
                className="mt-2 block w-full rounded-md px-3 py-2 text-left text-base font-medium"
                style={{ backgroundColor: "#ef4444", color: "white" }}
              >Logout</button>
            ) : (
              <Link to="/login" onClick={() => setNavOpen(false)} className="mt-2 block rounded-md px-3 py-2 text-base font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
