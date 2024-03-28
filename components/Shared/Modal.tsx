import React, { useRef } from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({
  isOpen,
  onClose,
  description,
  title,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
        className="bg-white p-4 rounded-md shadow-lg max-w-md w-full transform transition-transform ease-in-out duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold text-red-600">{title}</p>
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        <p className="px-4 text-gray-700 mb-6">{description}</p>
        <div className="flex p-4 justify-end space-x-4">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
          <button
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
