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
import AvatarUpload from '../shared/AvatarUpload';

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
      // navigate('/');
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
      <div className="flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden app-shell">
        <Header />
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />
        
        {/* Mobile Drawer */}
        {isMobile && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]" onClick={handleMobileClose}>
            <div className="absolute left-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col shadow-2xl" style={{ backgroundColor: "var(--surface)" }} onClick={(e) => e.stopPropagation()}>
              <div className="flex h-14 shrink-0 items-center justify-between border-b px-4" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                <h2 className="font-semibold">Your chats</h2>
                <button onClick={handleMobileClose} className="rounded-lg px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: "var(--surface-soft)" }}>Close</button>
              </div>
              <div className="shrink-0 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                <AvatarUpload user={user} className="h-11 w-11" showLabel />
              </div>
              {isLoading ? (
                <div className="m-3 h-20 animate-pulse rounded-xl bg-gray-300" />
              ) : (
                <ChatList
                  className="min-h-0 flex-1"
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                  onChatSelect={handleMobileClose}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          {/* Chat List - Hidden on mobile */}
          <div className="hidden min-h-0 min-w-0 border-r sm:block sm:w-1/3 md:w-1/4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
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
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            <WrappedComponent {...props} chatId={chatId} user={user} onlineUsers={onlineUsers} />
          </div>

          {/* Profile - Hidden on mobile and small screens */}
          <div className="hidden min-h-0 overflow-y-auto p-5 xl:block xl:w-1/4 xl:p-8" style={{ backgroundColor: "var(--surface)", color: "var(--text)", borderLeft: "1px solid var(--border)" }}>
            <Profile user={user} />
          </div>
        </div>
      </div>
    );
  };

  return HOC;
};

export default AppLayout;
