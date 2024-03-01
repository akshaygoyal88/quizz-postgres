"use client";

import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import SelectWrapper from "@/components/Shared/SelectWrapper";

const SubscribersList = ({
  list,
  selectedList,
  selectAll,
  searchTerm,
  filteredList,
  handleSelectAll,
  handleSubscriberSelection,
}: {
  list: [];
  selectedList: [];
  selectAll: boolean;
  searchTerm: string;
  filteredList: [];
  handleSelectAll: () => void;
  handleSubscriberSelection: () => void;
}) => {
  const [quizName, setQuizName] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setQuizName(urlParams.get("quizName") || "Quiz Name");
  }, []);

  const listOfSubscribers = searchTerm ? filteredList : list;

  return list ? (
    <div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="text-white bg-gray-800">
          <tr>
            <th className="py-3 px-4 text-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="py-3 px-4 text-left">Candidate Name</th>
            <th className="py-3 px-4 text-left">Subscription Date and Time</th>
            <th className="py-3 px-4 text-left">Approve</th>
          </tr>
        </thead>
        <tbody>
          {listOfSubscribers?.map((subscriber: any) => (
            <tr
              key={subscriber.id}
              className={`${
                selectedList.findIndex((s) => s.id === subscriber.id) !== -1
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={
                    selectedList.findIndex((s) => s.id === subscriber.id) !== -1
                  }
                  onChange={() => handleSubscriberSelection(subscriber.id)}
                />
              </td>
              <td className="py-3 px-4">{`${subscriber.user.first_name} ${subscriber.user.last_name}`}</td>
              <td className="py-3 px-4">
                {format(new Date(subscriber.startedAt), "MM/dd/yyyy HH:mm:ss")}
              </td>
              <td className="py-3 px-4">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  // onClick={() => approveSubscriber(subscriber.id)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;
};

const Subscribers = SelectWrapper(SubscribersList);

export default Subscribers;
