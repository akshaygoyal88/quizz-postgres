import React, { useEffect, useState } from "react";

interface TableRows {}

interface TableProps {
  headers: (string | React.ReactNode)[];
  rows: React.ReactNode[][];
}

export function Table({ headers, rows }: TableProps) {
  return (
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="text-white bg-gray-800">
        <tr>
          {headers.map((header: any, index: any) => (
            <th key={header + index} className="py-3 px-4 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td className="py-3 px-4" key={cellIndex}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
