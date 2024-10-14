import { useFetchData } from "6pp";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import moment from "moment";
import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const Appbar = (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 my-6 flex items-center">
      <AdminPanelSettingsIcon className="text-3xl" />
      <input
        type="text"
        placeholder="Search..."
        className="ml-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 w-full sm:w-1/3"
      />
      <button className="ml-4 p-2 bg-blue-500 text-white rounded-lg">Search</button>
      <div className="ml-auto text-gray-500 hidden lg:block">
        {moment().format("dddd, D MMMM YYYY")}
      </div>
      <NotificationsIcon className="ml-4 text-gray-500" />
    </div>
  );

  const Widgets = (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center my-8">
      <Widget title="Users" value={stats?.usersCount} Icon={<PersonIcon />} />
      <Widget title="Chats" value={stats?.totalChatsCount} Icon={<GroupIcon />} />
      <Widget title="Messages" value={stats?.messagesCount} Icon={<MessageIcon />} />
    </div>
  );

  return (
    <AdminLayout>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-10">
            Loading...
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4">
          {Appbar}

          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-2xl">
              <h4 className="text-2xl mb-6">Last Messages</h4>
              <LineChart value={stats?.messagesChart || []} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg flex items-center justify-center w-full max-w-md relative">
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalChatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              />
              <div className="absolute flex items-center justify-center w-full h-full text-gray-600">
                <GroupIcon className="mr-1" /> <span>Vs</span>{" "}
                <PersonIcon className="ml-1" />
              </div>
            </div>
          </div>

          {Widgets}
        </main>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-80">
    <div className="flex flex-col items-center">
      <div className="text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-full p-4 w-20 h-20 flex items-center justify-center text-2xl mb-4">
        {value}
      </div>
      <div className="flex items-center gap-2">
        {Icon}
        <span className="text-lg">{title}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
