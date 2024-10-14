import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AvatarCard from "../components/shared/AvtarCard";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);
  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [members, setMembers] = useState([]);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/friends");
  };

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  const IconBtns = (
    <>
      <div className="fixed top-4 right-4 sm:hidden">
        <IconButton onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
          <MenuIcon />
        </IconButton>
      </div>
   
     <Tooltip title="back">
      <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: "rgba(0,0,0,0.9)",
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <div className="flex items-center justify-center gap-4 py-2 px-4 pb-4 bg-gray-600 rounded-lg shadow-md">
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            variant="outlined"
            size="small"
            className="flex-grow"
            InputProps={{
              style: {
                backgroundColor: "#fff", // Background for the input
              },
            }}
          />
          <IconButton
            onClick={updateGroupName}
            disabled={isLoadingGroupName}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <DoneIcon style={{ color: "white" }} />
          </IconButton>
        </>
      ) : (
        <>
          <h1 className="text-3xl text-white">{groupName}</h1>
          <IconButton
            disabled={isLoadingGroupName}
            onClick={() => setIsEdit(true)}
            className="hover:bg-gray-700 transition-colors"
          >
            <EditIcon style={{ color: "white" }} />
          </IconButton>
        </>
      )}
    </div>
  );
  

  const ButtonGroup = (
    <div className="flex flex-col sm:flex-row gap-4 py-4 px-4 md:px-16">
      <button
        className="bg-red-600 text-white px-4 py-2 flex items-center gap-2 rounded-lg shadow-md hover:bg-red-500 transition"
        onClick={openConfirmDeleteHandler}
      >
        <DeleteIcon /> Delete Group
      </button>
      <button
        className="bg-blue-600 text-white px-4 py-2 flex items-center gap-2 rounded-lg shadow-md hover:bg-blue-500 transition"
        onClick={openAddMemberHandler}
      >
        <AddIcon /> Add Member
      </button>
    </div>
  );

  return myGroups.isLoading ? (
    <div className="flex items-center justify-center h-screen">Loading...</div> // Replace this with a Loader component if needed
  ) : (
    <div className="flex h-screen">
      {/* Sidebar for group list */}
      <div className="hidden sm:block sm:w-1/4 border-r border-gray-300">
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col items-center sm:w-3/4 w-full p-8 relative">
        {IconBtns}

        {groupName && (
          <>
            {GroupName}

            <h2 className="my-8 font-medium text-3xl">Group Members</h2>

            <div className="w-full max-w-2xl overflow-auto h-72 flex flex-col gap-4 p-4 border border-gray-300 rounded-lg shadow-md">
              {/* Members */}
              {isLoadingRemoveMember ? (
                <CircularProgress />
              ) : (
                members.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </div>

            {ButtonGroup}
          </>
        )}
      </div>

      {isAddMember && (
        <Suspense fallback={<div>Loading...</div>}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
    </div>
  );
};

const GroupsList = ({ myGroups = [], chatId }) => (
  <div className="bg-gradient-to-r from-gray-900 to-gray-700 h-full overflow-auto p-4">
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <div className="text-center p-4 text-white font-bold">No groups</div>
    )}
  </div>
);

const GroupListItem = ({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
      className="flex  gap-4 p-4 rounded-lg hover:bg-gray-800 transition"
    >
      <AvatarCard avatar={avatar} />
      <span className="text-white text-2xl font-bold">{name}</span>
    </Link>
  );
};

export default Groups;
