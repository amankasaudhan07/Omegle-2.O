import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
// import { SearchIcon } from '@heroicons/react/24/solid';
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
  <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center"
     onClick={searchCloseHandler}
  >
    
   <div
      className="bg-white relative rounded-lg shadow-xl w-full max-w-md h-[500px] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
     <button 
        onClick={searchCloseHandler}
        className="absolute top-1 right-2 text-xl"
      >
        ✕
      </button>
      {/* Content */}
      <div className="p-6 overflow-hidden flex flex-col">
      
        <h2 className="text-2xl font-bold text-center mb-4">Find People</h2>

        <div className="relative">
          <input
            type="text"
            value={search.value}
            onChange={search.changeHandler}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..."
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Scrollable list */}
        <ul className="mt-4 space-y-2 overflow-y-auto flex-1">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
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
            <p className="text-center text-gray-500">No users found</p>
          )}
        </ul>
      </div>

      {/* Footer (fixed)
      <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={searchCloseHandler}
        >
          Close
        </button>
      </div> */}

    </div>
  </div>
);
};

export default Search;