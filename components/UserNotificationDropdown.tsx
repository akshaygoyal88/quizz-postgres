import React, { useState } from "react";
import { UserNotification } from "@prisma/client";
import { fetchData, FetchMethodE } from "@/utils/fetch";
import pathName from "@/constants";

interface NotificationDropdownProps {
  onClose: () => void;
  notificationData: UserNotification[];
  userId: string;
}

const UserNotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notificationData,
  userId,
  onClose,
}) => {
  const [showAll, setShowAll] = useState(false);

  const handleClearAll = async () => {
    const {
      data: dltRes,
      error: dltErr,
      isLoading: dltLoading,
    } = await fetchData({
      url: `${pathName.notificationApi.path}/${userId}`,
      method: FetchMethodE.DELETE,
    });

    // onClose();
  };

  const handleClickRead = async (notificationId: string) => {
    const {
      data,
      error,
      isLoading,
    } = await fetchData({
      url: `${pathName.notificationApi.path}/${notificationId}`,
      method: FetchMethodE.PUT,
      body: {
        isRead: true,
      },
    });
    console.log(data);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();

    const timeDifference = now.getTime() - date.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference > 24) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } else {
      const minutes = Math.floor(timeDifference / (1000 * 60));
      return `${minutes} minutes ago`;
    }
  };

  const sortedNotifications = [...notificationData].sort(
    (a, b) => b.time - a.time
  );

  const renderNotifications = showAll
    ? sortedNotifications
    : sortedNotifications.slice(0, 5);

  return (
    <div className="absolute right-0 mt-2">
      <div className="bg-white p-6 rounded-md shadow-md w-72 transform transition-transform ease-in-out duration-300">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        {renderNotifications.length > 0 ? (
          <div>
            {renderNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-2 ${
                  notification.isRead
                    ? "text-gray-600 bg-gray-200 "
                    : "font-bold bg-blue-300"
                } px-4 py-3 rounded-md hover:cursor-pointer transition duration-300 ease-in-out`}
                onClick={() => handleClickRead(notification.id)}
              >
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(notification.time)}
                </p>
              </div>
            ))}
            {sortedNotifications.length > 5 && !showAll && (
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => setShowAll(true)}
              >
                See All
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No new notifications</p>
        )}
        <div className="flex justify-end mt-4 space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-red-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotificationDropdown;
