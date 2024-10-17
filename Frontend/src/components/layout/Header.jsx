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

const SearchDialog = lazy(() => import('../specific/Search'));
const NotificationDialog = lazy(() => import('../specific/Notifications'));
const NewGroupDialog = lazy(() => import('../specific/NewGroup'));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const navigateBack = () => {
    navigate("/");
  };

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

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
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold hidden sm:block">Omegle 2.0</h1>
              <button 
                className="sm:hidden p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={handleMobile}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <IconBtn title="Search" icon={<Search />} onClick={openSearch} />
              <IconBtn title="New Group" icon={<UserPlus />} onClick={openNewGroup} />
              <IconBtn title="Manage Groups" icon={<Users />} onClick={navigateToGroup} />
              <IconBtn 
                title="Notifications" 
                icon={<Bell />} 
                onClick={openNotification}
                badge={notificationCount}
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
      className="p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white relative"
      onClick={onClick}
      title={title}
    >
      {icon}
      {badge && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

export default Header;