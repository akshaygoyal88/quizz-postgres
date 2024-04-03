"use client";
import React, { useState } from "react";
import pathName from "@/constants";
import { UserNotification } from "@prisma/client";
import { fetchData, FetchMethodE } from "@/utils/fetch";
import { UserDataType } from "@/types/types";
import { FaBell, FaRegBell } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

const NotificationIcon = ({
  userData,
  notificationData,
}: {
  userData: UserDataType;
  notificationData: UserNotification[];
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [actionTakenValue, setActionTakenValue] = useState(0);

  const unReadNotification = notificationData?.find(
    (notification) => !notification.isRead
  );

  const handleIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  const actionTaken = () => {
    setActionTakenValue(Math.random());
  };

  return (
    <div className="relative">
      <button className="text-2xl text-gray-600" onClick={handleIconClick}>
        {!unReadNotification ? (
          <FaRegBell className="w-6 h-6 text-blue-500" />
        ) : (
          <FaBell className="w-6 h-6 text-yellow-500" />
        )}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 z-50">
          <UserNotificationDropdown
            userId={userData.id}
            notificationData={notificationData}
            onClose={handleCloseDropdown}
            actionTaken={actionTaken}
            userData={userData}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

interface NotificationDropdownProps {
  onClose: () => void;
  notificationData: UserNotification[];
  userId: string;
  actionTaken: () => void;
  userData: UserDataType;
}

const UserNotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notificationData,
  userId,
  onClose,
  actionTaken,
  userData,
}) => {
  const [showAll, setShowAll] = useState(false);

  const handleClearAll = async () => {
    if (userData && userData.isProfileComplete) {
      const {
        data: dltRes,
        error: dltErr,
        isLoading: dltLoading,
      } = await fetchData({
        url: `${pathName.notificationApi.path}/${userId}`,
        method: FetchMethodE.DELETE,
      });
      actionTaken();
    }
  };

  const handleClickRead = async (notification: UserNotification) => {
    if (
      userData &&
      !userData.isProfileComplete &&
      notification?.message?.includes("Profile not completed")
    ) {
      return;
    }
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.notificationApi.path}/${notification.id}`,
      method: FetchMethodE.PUT,
      body: {
        isRead: true,
      },
    });

    actionTaken();
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();

    const timeDifference = now.getTime() - date.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference > 24) {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } else {
      const minutes = Math.floor(timeDifference / (1000 * 60));
      return minutes < 60
        ? `${minutes} minutes ago`
        : `${Math.floor(minutes / 60)}hr ago`;
    }
  };

  const handleClearNotification = async (notification: UserNotification) => {
    if (
      userData &&
      !userData.isProfileComplete &&
      notification?.message?.includes("Profile not completed")
    ) {
      return;
    }
    const { data, error, isLoading } = await fetchData({
      url: `${pathName.notificationApi.path}/${userId}?notificationId=${notification.id}`,
      method: FetchMethodE.DELETE,
    });
    actionTaken();
  };

  const sortedNotifications = [...notificationData].sort(
    (a, b) => b.time.getTime() - a.time.getTime()
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
                } px-4 py-3 flex items-start rounded-md hover:cursor-pointer transition duration-300 ease-in-out`}
                onClick={() => handleClickRead(notification)}
              >
                <span>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.time)}
                  </p>
                </span>
                {notification.isRead && (
                  <button
                    className="rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none"
                    onClick={() => handleClearNotification(notification)}
                  >
                    <IoMdCloseCircle className="w-6 h-6" />
                  </button>
                )}
              </div>
            ))}
            {sortedNotifications.length > 5 && !showAll && (
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => setShowAll(true)}
              >
                See more
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No new notifications</p>
        )}
        <div className="flex justify-between mt-4 space-x-4">
          <button
            className="px-4 py-2 text-blue-500 rounded-md focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
            onClick={onClose}
          >
            Close
          </button>
          {notificationData?.length > 0 && (
            <button
              className="px-4 py-2 text-red-500 rounded-md focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
