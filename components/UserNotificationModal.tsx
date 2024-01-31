import React from "react";
import { UserNotification } from "@prisma/client";

interface NotificationModalProps {
  onClose: () => void;
  notificationData: UserNotification[];
}

const UserNotificationModal: React.FC<NotificationModalProps> = ({
  notificationData,
  onClose,
}) => {
  console.log(notificationData);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Notification</h2>
        <div>
          {notificationData.map((notification) => (
            <p
              key={notification.id}
              className={`mb-2 ${
                notification.isRead
                  ? "text-gray-600"
                  : "font-bold bg-blue-300"
              } px-2 py-6 round-md`}
            >
              {notification.message}
            </p>
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserNotificationModal;
