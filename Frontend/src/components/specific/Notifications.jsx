import React, { memo } from 'react';
import UserAvatar from '../shared/UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from '../../redux/api/api';
import { setIsNotification } from '../../redux/reducers/misc';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  return (
    <Transition show={isNotification} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeHandler}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                <Dialog.Title
                  as="h3"
                  className="flex items-center justify-between text-lg font-medium leading-6"
                >
                  Notifications
                  <button onClick={closeHandler} className="rounded-full p-1">
                    <XMarkIcon className="h-5 w-5" style={{ color: "var(--muted)" }} />
                  </button>
                </Dialog.Title>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 rounded bg-slate-200"></div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                            <div className="col-span-1 h-2 rounded bg-slate-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {data?.allRequests.length > 0 ? (
                        data?.allRequests?.map(({ sender, _id }) => (
                          <NotificationItem
                            sender={sender}
                            _id={_id}
                            handler={friendRequestHandler}
                            key={_id}
                          />
                        ))
                      ) : (
                        <p className="app-muted text-center">0 notifications</p>
                      )}
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <div className="flex items-center space-x-4 py-3">
      <UserAvatar className="h-10 w-10" name={name} src={avatar} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" style={{ color: "var(--text)" }}>
          {`${name} sent you a friend request.`}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handler({ _id, accept: true })}
          className="rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-600"
        >
          Accept
        </button>
        <button
          onClick={() => handler({ _id, accept: false })}
          className="rounded-md bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600"
        >
          Reject
        </button>
      </div>
    </div>
  );
});

export default Notifications;
