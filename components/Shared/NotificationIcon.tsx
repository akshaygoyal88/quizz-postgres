"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserNotificationModal from "../userNotificationModal";
import { getNotifications } from "@/services/notification";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";

const NotificationIcon: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ses = useSession();
  const {
    data: notificationData,
    error: notificationErr,
    isLoading: notificationLoading,
  } = useFetch({
    url: `${pathName.notificationApi.path}/${ses?.data?.id}`,
  });

  // console.log(notificationData)
  // const getUserNotifications = async () => {
  //   const result = await getNotifications(ses?.data?.userId);
  //   if(result){
  //     console.log(result);
  //   }
  // }

  // useEffect(()=>{
  //   if(ses.status=== 'authenticated'){
  //     getUserNotifications();
  //   }
  // })

  const handleIconClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <button className="text-2xl text-gray-600" onClick={handleIconClick}>
        {/* <BellIcon className="w-6 h-6" /> */}
        {!notificationData?.length>0 ? <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg> :
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-blue-500"
        >
          <path
            fillRule="evenodd"
            d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
            clipRule="evenodd"
          />
        </svg>}
      </button>
      {isModalOpen && (
        <div className="absolute right-0 mt-2">
          <UserNotificationModal notificationData={notificationData} onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
