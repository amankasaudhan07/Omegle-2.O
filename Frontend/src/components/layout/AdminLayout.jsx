import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Laptop, Users, MessageSquare, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { adminLogout } from "../../redux/thunks/admin";

const adminTabs = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Chats", path: "/admin/chats", icon: Laptop },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
];

const Sidebar = ({ className = "" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <div className={`flex flex-col h-full p-6 bg-white ${className}`}>
      <h2 className="text-2xl font-bold uppercase mb-8">Chattu</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.path}>
                <Link
                  to={tab.path}
                  className={`flex items-center p-2 rounded-lg transition-colors ${
                    location.pathname === tab.path
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <button
        className="flex items-center justify-start p-2 w-full bg-transparent hover:bg-gray-100 rounded-lg"
        onClick={logoutHandler}
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:flex-shrink-0 md:w-64">
        <Sidebar />
      </aside>

      {/* Mobile menu */}
      <div className="md:hidden">
        <button
          className="fixed top-4 right-4 z-40 bg-white border border-gray-300 p-2 rounded-lg shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50">
            <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
              <Sidebar />
              <button
                className="absolute top-4 right-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
