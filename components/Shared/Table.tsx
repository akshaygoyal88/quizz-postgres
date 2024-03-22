import React from "react";

interface TableRows {}

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
}

export function Table({ headers, rows }: TableProps) {
  return (
    <table className="table-auto min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={header + index}
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                key={cellIndex}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
