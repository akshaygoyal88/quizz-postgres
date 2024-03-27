"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { SubscriptionTypes } from "@/types/types";
import Heading from "@/components/Shared/Heading";

const SubscribersList = ({
  listOfSubscribers,
  quizName,
}: {
  listOfSubscribers: SubscriptionTypes[] | { error: string };
  quizName?: string;
}) => {
  const [selectedSubscribers, setSelectedSubscribers] = useState<
    SubscriptionTypes[]
  >([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (
      !("error" in listOfSubscribers) &&
      selectedSubscribers.length === listOfSubscribers?.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [listOfSubscribers, selectedSubscribers]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(
        "error" in listOfSubscribers ? [] : listOfSubscribers
      );
    }
    setSelectAll(!selectAll);
  };

  const handleSubscriberSelection = (subscriberId: string) => {
    const index = selectedSubscribers.findIndex(
      (subscriber) => subscriber.id === subscriberId
    );
    if (index === -1) {
      setSelectedSubscribers([
        ...selectedSubscribers,
        listOfSubscribers.find(
          (subscriber: { id: string }) => subscriber.id === subscriberId
        ),
      ]);
    } else {
      setSelectedSubscribers([
        ...selectedSubscribers.slice(0, index),
        ...selectedSubscribers.slice(index + 1),
      ]);
    }
  };

  return !("error" in listOfSubscribers) ? (
    <div className="sm:px-6">
      <Heading headingText={`Subscriber for ${quizName}`} tag={"h2"} />
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
          {listOfSubscribers.map((subscriber: any) => (
            <tr
              key={subscriber.id}
              className={`${
                selectedSubscribers.findIndex((s) => s.id === subscriber.id) !==
                -1
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={
                    selectedSubscribers.findIndex(
                      (s) => s.id === subscriber.id
                    ) !== -1
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
                  //   onClick={() => approveSubscriber(subscriber.id)}
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

export default SubscribersList;
