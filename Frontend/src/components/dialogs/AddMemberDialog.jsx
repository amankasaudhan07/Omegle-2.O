import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { UserPlus, X } from 'lucide-react';

const UserItem = ({ user, handler, isAdded }) => (
  <div 
    className={`flex items-center p-2 rounded-lg cursor-pointer ${
      isAdded ? 'bg-blue-100' : 'hover:bg-gray-100'
    }`} 
    onClick={() => handler(user._id)}
  >
    <img 
      src={user.avatar} 
      alt={user.name} 
      className="w-10 h-10 rounded-full mr-3"
    />
    <span className="flex-grow">{user.name}</span>
    {isAdded && <UserPlus className="w-5 h-5 text-blue-500" />}
  </div>
);

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  const [addMembers, { isLoading: isLoadingAddMembers }] = useAddGroupMembersMutation();
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = async () => {
    try {
      await addMembers({ members: selectedMembers, chatId }).unwrap();
      closeHandler();
    } catch (err) {
      console.error('Failed to add members:', err);
      // Handle error (e.g., show an error message)
    }
  };

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="text-lg font-semibold">Error</h3>
            <button onClick={closeHandler}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4 text-gray-600">{error.message}</p>
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={closeHandler}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    isAddMember && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Add Member</h2>
            <button onClick={closeHandler} className="text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : data?.friends?.length > 0 ? (
              <div className="space-y-2">
                {data.friends.map((friend) => (
                  <UserItem
                    key={friend._id}
                    user={friend}
                    handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(friend._id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No Friends Available</p>
            )}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button 
              className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={closeHandler}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={addMemberSubmitHandler}
              disabled={isLoadingAddMembers || selectedMembers.length === 0}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isLoadingAddMembers ? 'Adding...' : 'Add Members'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddMemberDialog;
