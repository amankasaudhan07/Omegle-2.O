import React, { useState } from "react";
import UserAvatar from "../shared/UserAvatar";
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
      <div className="flex min-h-screen items-center justify-center bg-black/30 p-4">
        <div
          className="relative w-full max-w-md rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">New Group</h2>
            <button onClick={close}>
              <XMarkIcon className="h-5 w-5" style={{ color: "var(--muted)" }} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Group Name"
            value={groupName.value}
            onChange={groupName.changeHandler}
            className="mb-4 w-full rounded-md border px-3 py-2"
            style={{
              backgroundColor: "var(--surface-soft)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />

          <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
            {isLoading ? (
              <p className="app-muted text-center">Loading...</p>
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

          <div className="flex justify-end gap-2">
            <button
              onClick={close}
              className="rounded px-4 py-2"
              style={{ backgroundColor: "var(--surface-strong)", color: "var(--text)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={creating}
              className="rounded bg-blue-500 px-4 py-2 text-white"
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
    className="flex cursor-pointer items-center gap-3 rounded p-2"
    style={{
      backgroundColor: selected ? "var(--surface-strong)" : "transparent",
      color: "var(--text)",
    }}
  >
    <UserAvatar name={user.name} src={user.avatar} className="h-10 w-10" />
    <span className="flex-1 text-sm">{user.name}</span>
    {selected && <span className="text-blue-500">+</span>}
  </div>
);

export default NewGroup;
