import React, { useRef } from "react";

const DuplicateModal = ({
  isOpen,
  onClose,
  onDuplicate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: () => void;
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
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-md shadow-lg max-w-md w-full transform transition-transform ease-in-out duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold text-gray-900">
            Confirm Duplication
          </p>
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
        <p className="text-gray-700 mb-6">
          Are you sure you want to duplicate this item?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none"
            onClick={() => {
              onDuplicate();
              onClose();
            }}
          >
            Duplicate
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

export default DuplicateModal;
