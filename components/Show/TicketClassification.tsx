"use client";

import React, { useEffect, useState } from "react";

import TagInput from "../Shared/TagInputs";
import TableComponent from "./TableComponent";

const TicketClassification = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [fetchedShowData, setFetchedShowData] = useState<[]>();
  const [tags, setTags] = useState<string[]>([]);

  console.log(tags, "tags");

  console.log(fetchedShowData, "fetchedShowData");

  const userId = "clq6mt3dk00083nqt2smexsyr";
  const fetchShowInformation = async () => {
    try {
      const response = await fetch(`/api/getShowDetails?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setFetchedShowData(data.showInformation);
        console.log("Show information:", data);
      } else {
        console.error("Failed to fetch show information");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    fetchShowInformation();
  }, []);

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShowId = e.target.value;
    setSelectedOption(selectedShowId);
  };

  const handleSubmit = () => {};

  return (
    <div className="mx-auto mt-8 max-w-md rounded bg-white p-6 shadow-lg">
      <div className="m-2">
        {/* Dropdown */}
        <h1 className="my-2">Select Show</h1>
        <div className="mb-4 flex items-center">
          <select
            value={selectedOption}
            onChange={handleDropdownChange}
            className="w-full rounded border bg-slate-200 px-4 py-1 text-lg transition duration-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a show</option>
            {fetchedShowData &&
              fetchedShowData.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.showName}
                </option>
              ))}
          </select>
        </div>

        {/* Add Ticket Groups Tag component */}
        <div className="">
          <h1 className="my-2">Add Ticket Groups</h1>
          <TagInput tags={tags} setTags={setTags} />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="ml-36 rounded bg-blue-500 px-10 py-2 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TicketClassification;
