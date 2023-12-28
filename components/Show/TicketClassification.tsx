"use strict";

import React, { useState, ChangeEvent, useEffect } from "react";
import TagInput from "../Shared/TagInputs";
import TableComponent from "./TableComponent";
import { useRouter } from "next/navigation";

interface ShowData {
  showName: string;
  showType: string;
  showMode: string;
  showStartDateAndTime: string;
  showEndDateAndTime: string;
  noOfTickets: number;
  createdById: string;
  createdAt: string;
}

interface TicketClassificationProps {
  fetchedShowData: ShowData[];
}

const TicketClassification: React.FC<TicketClassificationProps> = ({
  fetchedShowData,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  const profileCompleted = async () => {
    const res = await fetch("/api/getProfileCompleted/");
    const isProfileCompleted = await res.json();
    if (!isProfileCompleted) {
      router.push("/profile");
    }
  };
  useEffect(() => {
    profileCompleted();
  }, []);

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedShowId: string = e.target.value;
    setSelectedOption(selectedShowId);
  };

  return (
    <div className="w-full mx-auto mt-8 max-w-xl rounded bg-white p-6 shadow-lg">
      <div className="m-2">
        {/* Dropdown */}
        <h1 className="my-2 ml-28">Select Show</h1>
        <div className="mb-4 flex items-center">
          <select
            value={selectedOption}
            onChange={handleDropdownChange}
            className="w-1/2 ml-28 rounded border bg-slate-200 px-4 py-1 text-lg transition duration-300 focus:border-blue-500 focus:outline-none"
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
        <div className="ml-28">
          <h1 className="my-3">Add Ticket Groups</h1>
          <TagInput tags={tags} setTags={setTags} />
        </div>
      </div>
      <div>
        <TableComponent selectedShowId={selectedOption} tags={tags} />
      </div>
    </div>
  );
};

export default TicketClassification;
