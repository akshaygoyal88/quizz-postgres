// Pagination.tsx

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
  page: number;
  totalpage: number;
  paginate: (pageNumber: React.SetStateAction<number>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalpage,
  paginate,
}) => {
  return (
    <div className="w-full flex justify-evenly sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {totalpage ? 1 + (page - 1) * 9 : totalpage}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {totalpage ? page * 9 : totalpage}
          </span>{" "}
          of <span className="font-medium">{totalpage * 9}</span> results
        </p>
      </div>
      <div>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            onClick={() => paginate(page - 1)}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          {Array.from({ length: totalpage }).map((_, index) => (
            <button
              key={index}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                index + 1 === page
                  ? "bg-indigo-600 text-white focus:outline"
                  : "text-gray-900 hover:bg-gray-50 focus:outline"
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            onClick={() => paginate(page + 1)}
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
