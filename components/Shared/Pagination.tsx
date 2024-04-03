import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PaginationProps {
  page?: number;
  totalpage: number;
  totalRows: number;
  pageSize?: number;
  paginate?: (pageNumber: React.SetStateAction<number>) => void;
  urlInitialization?: any;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalpage,
  totalRows,
  pageSize,
  paginate,
  urlInitialization,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    if (pageNumber <= totalpage && pageNumber > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNumber.toString());
      router.push(`${pathname}?${params.toString()}`);
      return `${pathname}?${params.toString()}`;
    }
  };
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => createPageURL(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => createPageURL(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden justify-evenly sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {totalpage ? 1 + (currentPage - 1) * (pageSize || 9) : totalpage}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {currentPage * (pageSize || 9) < totalRows
                ? currentPage * (pageSize || 9)
                : totalRows}
            </span>{" "}
            of <span className="font-medium">{totalRows}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => createPageURL(currentPage - 1)}
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalpage }).map((_, index) => (
              <button
                key={index}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  index + 1 === currentPage
                    ? "bg-indigo-600 text-white focus:outline"
                    : "text-gray-900 hover:bg-gray-50 focus:outline"
                }`}
                onClick={() => {
                  createPageURL(index + 1);
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => {
                createPageURL(currentPage + 1);
              }}
            >
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
