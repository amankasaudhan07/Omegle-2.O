import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Header from "../layout/Header"

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { data, isLoading } = useAvailableFriendsQuery();
  const [createGroup, creating] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [members, setMembers] = useState([]);

  const close = () => dispatch(setIsNewGroup(false));

  const toggleMember = (id) => {
    setMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!groupName.value) return toast.error("Group name required");
    if (members.length < 2) return toast.error("Select at least 3 members");

    createGroup("Creating...", {
      name: groupName.value,
      members,
    });

    close();
  };

  if (!isNewGroup) return null;

  return ( 
    <Dialog open={isNewGroup} onClose={close} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black/30 p-4">
        
        <div className="w-full max-w-md bg-white rounded-xl p-5 relative">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">New Group</h2>
            <button onClick={close}>
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Group Name"
            value={groupName.value}
            onChange={groupName.changeHandler}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />

          {/* Members */}
          <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              data?.friends?.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  selected={members.includes(user._id)}
                  onClick={() => toggleMember(user._id)}
                />
              ))
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={creating}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>

        </div>
      </div>
    </Dialog>
   
  );
};

const UserItem = ({ user, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
      selected ? "bg-blue-100" : "hover:bg-gray-100"
    }`}
  >
    <img
      src={user.avatar || "/placeholder-avatar.png"}
      alt={user.name}
      className="w-10 h-10 rounded-full"
    />
    <span className="flex-1 text-sm">{user.name}</span>
    {selected && <span className="text-blue-500">✔</span>}
  </div>
);

export default NewGroup;