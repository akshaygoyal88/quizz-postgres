import React, { useRef } from "react";

const Modal = ({
  isOpen,
  onClose,

  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const modalRef = useRef(null);

  const handleBackgroundClick = (e: { target: any }) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-md shadow-lg max-w-md w-full transform transition-transform ease-in-out duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold text-red-600">{title}</p>
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
