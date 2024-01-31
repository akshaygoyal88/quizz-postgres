import React from 'react';

interface NotificationModalProps {
  onClose: () => void;
}

const UserNotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">New Notification</h2>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod mauris vel massa dapibus, nec dapibus arcu iaculis.
        </p>
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
