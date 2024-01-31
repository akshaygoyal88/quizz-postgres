import React from "react";
import { UserNotification } from "@prisma/client";
import { fetchData, FetchMethodE } from "@/utils/fetch";
import pathName from "@/constants";

interface NotificationModalProps {
  onClose: () => void;
  notificationData: UserNotification[];
  userId: string;
}

const UserNotificationModal: React.FC<NotificationModalProps> = ({
  notificationData,
  userId,
  onClose,
}) => {
  console.log(notificationData);

  const handleClearAll = async () =>{
    const {
      data: dltRes,
      error: dltErr,
      isLoading: dltLoading,
    } = await fetchData({
      url: `${pathName.notificationApi.path}/${userId}`,
      method: FetchMethodE.DELETE,
    });

    // onClose();
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Notification</h2>
        {notificationData?.length > 0 ?<div>
          {notificationData.map((notification) => (
            <p
              key={notification.id}
              className={`mb-2 ${
                notification.isRead
                  ? "text-gray-600"
                  : "font-bold bg-blue-300"
              } px-2 py-6 rounded-md`}
            >
              {notification.message}
            </p>
          ))}
        </div>: <p>No new notifications</p>}
        <div className="w-full flex justify-between">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-red-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
          onClick={handleClearAll}
        >
          Clear All
        </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotificationModal;
