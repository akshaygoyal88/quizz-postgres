"use client";
import InputWithLabel from "@/components/Shared/InputWithLabel";
import React, { useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaPencil } from "react-icons/fa6";

const TableComponent = ({ selectedShowId, onSave, onRemove, onEdit, tags }) => {
  const [tableData, setTableData] = useState({
    quantity: "",
    price: "",
  });
  const [selectedTag, setSelectedTag] = useState();

  console.log(selectedShowId, "selectedShowId");
  console.log(tableData, "setTableData");

  const handleSave = async () => {
    console.log("inside handle save ");
    const userId = "clq511pdy0000op42iuzmwsej";
    const response = await fetch("/api/ticketDetailsApi/insertTicketDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketGroup: selectedTag,
        quantity: tableData.quantity,
        price: tableData.price,
        createdById: userId,
        showId: selectedShowId,
      }),
    });

    if (response.ok) {
      alert("data inserted successfully");
    } else {
      alert("data not inserted");
    }
  };

  const handleRemove = async () => {
    //   const ticketId = "replace_with_actual_ticket_id";
    //   if(ticketId) {
    //   const response = await fetch(`/api/removeTicketDetails?Id=${ticketId}`, {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    setTableData({
      quantity: "",
      price: "",
    });

    //     if(response.ok){
    //     console.log("Data removed successfully!");
    //     }else{
    //      console.log("unable to removed Data.");
    //   }
    // };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const sanitizedValue = value.replace(/[^0-9]/g, "");

    setTableData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded bg-white p-6 shadow-lg">
      <span className="w-1/4 px-2 py-2 ">Select Ticket Group: </span>

      <table className="w-full table-fixed">
        <thead>
          <tr>
            <th className="w-1/4 px-2 py-2">Group</th>
            <th className="w-1/4 px-2 py-2">Quantity</th>
            <th className="w-1/4 px-2 py-2">Price</th>
            <th className="w-1/4 px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-2">
              <div className="border px-2 py-2 mb-4 mt-2">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full rounded border px-1 py-1 text-sm transition duration-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Ticket Group</option>
                  {tags &&
                    tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                </select>
              </div>
            </td>
            <td className="border px-2 py-2">
              <InputWithLabel
                name="quantity"
                type="text"
                value={tableData.quantity}
                onChange={handleChange}
                inputMode="numeric"
                className="w-full rounded border px-1 py-1 text-lg transition duration-300 focus:border-blue-500 focus:outline-none"
              />
            </td>
            <td className="border px-2 py-2 items-center">
              <InputWithLabel
                type="text"
                name="price"
                value={tableData.price}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border px-2 text-gray-700"
                inputMode="numeric"
              />
            </td>
            <td className="flex-col border px-2 py-2">
              <button
                onClick={handleSave}
                // disabled={selectedShowId === ""}
                className="w-10 my-1 ml-3 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-700 flex items-center"
              >
                <IoMdDoneAll className="mr-1" />
              </button>
              <button
                onClick={handleRemove}
                // disabled={selectedShowId === ""}
                className=" rounded ml-3 bg-red-500 px-3 py-1 text-white hover:bg-red-700"
              >
                <RxCross2 className="color-red" />
              </button>
              <button
                onClick={onEdit}
                // disabled={selectedShowId === ""}
                className="rounded ml-3 bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
              >
                <FaPencil />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
