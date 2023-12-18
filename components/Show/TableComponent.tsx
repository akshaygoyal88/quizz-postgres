"use client";
import InputWithLabel from "@/components/Shared/InputWithLabel";
import React, { useState } from "react";

const TableComponent = ({ selectedShowId, onSave, onRemove, onEdit }) => {
  const [tableData, settableData] = useState({
    quantity: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const sanitizedValue = value.replace(/[^0-9]/g, "");

    settableData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded bg-white p-6 shadow-lg">
      <table className="w-full table-fixed">
        <thead>
          <tr>
            <th className="w-1/4 px-2 py-2">Ticket Group</th>
            <th className="w-1/4 px-2 py-2">Quantity</th>
            <th className="w-1/4 px-2 py-2">Price</th>
            <th className="w-1/4 px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-2">
              <select disabled={selectedShowId === ""}>
                {/* Options for tags */}
                {/* Replace with your tag options */}
              </select>
            </td>
            <td className="border px-2 py-2">
              <InputWithLabel
                name="quantity"
                type="text"
                value={tableData.quantity}
                onChange={handleChange}
                inputMode="numeric"
                className="w-full rounded border bg-slate-200 px-2 py-1 text-lg transition duration-300 focus:border-blue-500 focus:outline-none"
              />
            </td>
            <td className="border px-2 py-2">
              <InputWithLabel
                type="text"
                name="price"
                value={tableData.price}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border px-2 text-gray-700"
                inputMode="numeric"
                // label=" Number of Tickets:"
              />
            </td>
            <td className="border px-2 py-2">
              <button
                onClick={onSave}
                disabled={selectedShowId === ""}
                className="mr-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={onRemove}
                disabled={selectedShowId === ""}
                className="mr-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700"
              >
                Remove
              </button>
              <button
                onClick={onEdit}
                disabled={selectedShowId === ""}
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
