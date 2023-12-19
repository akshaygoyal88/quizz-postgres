"use client";

import React, { useState } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Checkboxes from "../Shared/Checkboxes";

export type showDetails = {
  showName: string;
  showType: string;
  showStartDateAndTime: string;
  showEndDateAndTime: string;
  noOfTickets: string | undefined;
};

const ShowInformation = () => {
  const [formData, setFormData] = useState<showDetails>({
    showName: "",
    showType: "",
    showStartDateAndTime: "",
    showEndDateAndTime: "",
    noOfTickets: undefined,
  });

  const [showMode, setShowMode] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const sanitizedValue =
      name === "noOfTickets" ? value.replace(/[^0-9]/g, "") : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  const userId = "clq511pdy0000op42iuzmwsej";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    const response = await fetch("/api/showDetailsApi/insertShowDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        showName: formData.showName,
        showType: formData.showType,
        showStartDateAndTime: formData.showStartDateAndTime,
        showEndDateAndTime: formData.showEndDateAndTime,
        noOfTickets: formData.noOfTickets,
        showMode: showMode,
      }),
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}T${hours}:${minutes}`;
  };

  console.log(showMode, "showMode");

  const handleShowModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowMode(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-gray w-96 flex-col items-center justify-center overflow-hidden rounded px-10 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <InputWithLabel
            type="text"
            name="showName"
            value={formData.showName}
            onChange={handleChange}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            label={"Show Name:"}
          />
        </div>
        <div className="mb-4">
          <InputWithLabel
            type="text"
            name="showType"
            value={formData.showType}
            onChange={handleChange}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            label="Show Type:"
          />
        </div>
        <div>
          <label className="mb-2 block font-bold ">Show Mode:</label>

          <div className="mb-2">
            <label className="mr-2 inline-flex items-center">
              <Checkboxes
                name="showMode"
                type="radio"
                value="ONLINE"
                checked={showMode === "ONLINE"}
                onChange={handleShowModeChange}
                className="form-radio text-indigo-600"
                label="Online"
              />
            </label>
            <label className="mx-2 inline-flex items-center">
              <Checkboxes
                name="showMode"
                type="radio"
                value="OFFLINE"
                checked={showMode === "OFFLINE"}
                onChange={handleShowModeChange}
                className="form-radio text-indigo-600"
                label="Offline"
              />
            </label>
            <label className="mx-2 inline-flex items-center">
              <Checkboxes
                name="showMode"
                type="radio"
                value="BOTH"
                checked={showMode === "BOTH"}
                onChange={handleShowModeChange}
                className="form-radio text-indigo-600"
                label="Both"
              />
            </label>
          </div>
        </div>
        <div className="mb-4">
          <InputWithLabel
            type="datetime-local"
            name="showStartDateAndTime"
            value={formData.showStartDateAndTime}
            onChange={handleChange}
            min={getMinDateTime()}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            label="Show Start Date and Time:"
          />
        </div>
        <div className="mb-4">
          <InputWithLabel
            type="datetime-local"
            name="showEndDateAndTime"
            value={formData.showEndDateAndTime}
            onChange={handleChange}
            min={getMinDateTime()}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            label=" Show End Date and Time:"
          />
        </div>
        <div className="mb-4">
          <InputWithLabel
            type="text"
            name="noOfTickets"
            value={formData.noOfTickets}
            onChange={handleChange}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            inputMode="numeric"
            label=" Number of Tickets:"
          />
        </div>
        <div className="mb-4 flex justify-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-xl bg-blue-500 px-9 py-2 text-sm text-white hover:bg-blue-700 hover:shadow-lg"
          >
            Save & Next
          </button>
        </div>{" "}
      </form>
    </div>
  );
};
export default ShowInformation;
