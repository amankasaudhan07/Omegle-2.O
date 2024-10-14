import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={params.row.avatar}
          alt="Avatar"
        />
      </div>
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <div className="flex items-center space-x-2">
        {params.row.members.map((member, index) => (
          <img
            key={index}
            className="w-10 h-10 rounded-full object-cover"
            src={member}
            alt={`Member ${index}`}
          />
        ))}
      </div>
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <div className="flex items-center space-x-4">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={params.row.creator.avatar}
          alt="Creator Avatar"
        />
        <span>{params.row.creator.name}</span>
      </div>
    ),
  },
];

const ChatManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((img) => transformImage(img, 50)),
          members: i.members.map((m) => transformImage(m.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Chats</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left border-collapse">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.field}
                      className="px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 font-bold text-sm text-gray-800 dark:text-gray-200"
                    >
                      {col.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`bg-white dark:bg-gray-800 ${
                      idx % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.field}
                        className="px-4 py-2 border-b border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {col.renderCell ? col.renderCell({ row }) : row[col.field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
