import React, { memo } from 'react';
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <div className="flex items-center space-x-4 py-2 px-4" style={styling}>
      <img 
        src={transformImage(avatar)} 
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {name}
        </p>
      </div>
      <button
        onClick={() => handler(_id)}
        disabled={handlerIsLoading}
        className={`
          p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isAdded 
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
            : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}
          ${handlerIsLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="sr-only">{isAdded ? 'Remove' : 'Add'} user</span>
        {isAdded ? (
          <RemoveIcon className="h-5 w-5 text-white" />
        ) : (
          <AddIcon className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  );
};

const RemoveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const AddIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default memo(UserItem);