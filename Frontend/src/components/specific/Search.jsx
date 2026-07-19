import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setLoading(true);
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  if (!isSearch) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={searchCloseHandler}
    >
      <div
        className="relative flex h-[500px] w-full max-w-md flex-col rounded-2xl shadow-xl"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={searchCloseHandler}
          className="absolute right-3 top-2 text-xl"
          style={{ color: "var(--muted)" }}
        >
          x
        </button>

        <div className="flex flex-1 flex-col overflow-hidden p-6">
          <h2 className="mb-4 text-center text-2xl font-bold">Find People</h2>

          <div className="relative">
            <input
              type="text"
              value={search.value}
              onChange={search.changeHandler}
              className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--surface-soft)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              placeholder="Search users..."
            />
            <SearchIcon
              className="absolute left-3 top-2.5 h-5 w-5"
              style={{ color: "var(--muted)" }}
            />
          </div>

          <ul className="mt-4 flex-1 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="app-muted text-center">Loading...</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  handler={addFriendHandler}
                  handlerIsLoading={isLoadingSendFriendRequest}
                />
              ))
            ) : (
              <p className="app-muted text-center">No users found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;
