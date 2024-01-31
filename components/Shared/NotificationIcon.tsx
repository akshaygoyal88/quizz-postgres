import React, { useState } from 'react';
import UserNotificationModal from '../userNotificationModal';

const NotificationIcon: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIconClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <button className="text-2xl text-gray-600" onClick={handleIconClick}>
        🔔
      </button>
      {isModalOpen && <UserNotificationModal onClose={handleCloseModal} />}
    </div>
  );
};

export default NotificationIcon;
