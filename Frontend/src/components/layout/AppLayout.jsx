import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getOrSaveFromStorage } from '../../lib/features';
import { useMyChatsQuery } from '../../redux/api/api';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc';
import { getSocket } from '../../socket';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import Header from './Header';

// AppLayout as a Higher-Order Component
const AppLayout = (WrappedComponent) => {
  const HOC = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    // console.log("layout",socket);

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery('');

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback((data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    }, [chatId, dispatch]);

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate('/');
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <div className="flex flex-col h-screen">
        <Header />
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />
        
        {/* Mobile Drawer */}
        {isMobile && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={handleMobileClose}>
            <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white" onClick={(e) => e.stopPropagation()}>
              {isLoading ? (
                <div className="animate-pulse bg-gray-300 h-full" />
              ) : (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Chat List - Hidden on mobile */}
          <div className="hidden sm:block sm:w-1/3 md:w-1/4 border-r border-gray-200">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 h-full" />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1  overflow-y-auto">
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </div>

          {/* Profile - Hidden on mobile and small screens */}
          <div className="hidden md:block md:w-1/3 lg:w-1/4 bg-gray-900 text-white p-8">
            <Profile user={user} />
          </div>
        </div>
      </div>
    );
  };

  return HOC;
};

export default AppLayout;
