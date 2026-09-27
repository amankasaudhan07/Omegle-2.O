import {
  Bell,
  LogOut,
  Menu,
  Search,
  UserPlus,
  Users
} from 'lucide-react';
import React, { Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetNotificationCount } from '../../redux/reducers/chat';
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from '../../redux/reducers/misc';
import logo from '../../assets/logo.png'
import { Badge } from "@mui/material";
import { useTheme } from './ThemeProvider';
import AvatarUpload from '../shared/AvatarUpload';

const SearchDialog = lazy(() => import('../specific/Search'));
const NotificationDialog = lazy(() => import('../specific/Notifications'));
const NewGroupDialog = lazy(() => import('../specific/NewGroup'));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const navigateBack = () => {
    navigate("/");
  };

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate('/groups');

  
  return (
    <>
      <header
        className="border-b"
        style={{
          backgroundColor: isDarkMode ? "#111827" : "var(--surface)",
          color: isDarkMode ? "#f8fafc" : "var(--text)",
          borderColor: isDarkMode ? "#1f2937" : "var(--border)",
        }}
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 sm:h-16 sm:gap-4">
            <div className="flex items-center">
              {/* <h1 className="text-xl font-bold hidden sm:block">Omegle 2.0</h1> */}
               {/* Left: Logo / Icon */}
                <div className="min-w-0 flex-shrink-0">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-9 w-20 object-contain sm:h-14 sm:w-36"
                  />
                </div>
              <button 
                className="rounded-lg p-2 focus:outline-none sm:hidden"
                onClick={handleMobile}
                aria-label="Open chat list"
                style={{ backgroundColor: "var(--surface-soft)" }}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-3">
              <div className="hidden xl:hidden sm:block">
                <AvatarUpload user={user} className="h-9 w-9" />
              </div>
              <button
                className="hidden sm:block px-4 py-2 rounded-full text-sm font-semibold"
                onClick={toggleTheme}
                style={{
                  backgroundColor: "var(--surface-soft)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {isDarkMode ? "Light" : "Dark"}
              </button>
              <IconBtn title="Search" icon={<Search />} onClick={openSearch} />
              <IconBtn title="New Group" icon={<UserPlus />} onClick={openNewGroup} />
              <IconBtn title="Manage Groups" icon={<Users />} onClick={navigateToGroup} />
              {/* <IconBtn 
                title="Notifications" 
                icon={<Bell />} 
                onClick={openNotification}
                badge={notificationCount}
              /> */}
              <IconBtn 
                title="Notifications" 
                icon={
                  <Badge
                    badgeContent={notificationCount}
                    color="error"
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <Bell />
                  </Badge>
                } 
                onClick={openNotification}
              />
              <IconBtn title="Back" icon={<LogOut />} onClick={navigateBack} />
            </div>
          </div>
        </div>
      </header>

      {isSearch && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50" />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50" />}>
          <NotificationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50" />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, badge }) => {
  return (
    <button
      className="relative rounded-full p-1.5 sm:p-2"
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{ backgroundColor: "var(--surface-soft)", color: "var(--text)" }}
    >
      <span className="block [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">{icon}</span>
      {badge && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

export default Header;
