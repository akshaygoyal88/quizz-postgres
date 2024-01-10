"use client";
import React, { useEffect, useState } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Checkboxes from "../Shared/Checkboxes";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

export type ShowDetails = {
  showName: string;
  showType: string;
  showStartDateAndTime: string;
  showEndDateAndTime: string;
  noOfTickets: string | undefined;
};

const ShowInformation = ({ session }: { session: Session | null }) => {
  const [formData, setFormData] = useState<ShowDetails>({
    showName: "",
    showType: "",
    showStartDateAndTime: "",
    showEndDateAndTime: "",
    noOfTickets: undefined,
  });

  const [showMode, setShowMode] = useState<string>("");
  const [createTicket, setCreateTicket] = useState<boolean>(false);

  console.log(createTicket, "create ticket");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [userDetails, setUserDetails] = useState();
  const route = useRouter();

  const getUserData = async () => {
    try {
      const res = await fetch("/api/user/", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setUserDetails({ ...data });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const profileCompleted = async () => {
    const res = await fetch("/api/getProfileCompleted/");
    const isProfileCompleted = await res.json();
    if (!isProfileCompleted) {
      route.push("/profile");
    }
  };
  useEffect(() => {
    profileCompleted();
    getUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const sanitizedValue =
      name === "noOfTickets" ? value.replace(/[^0-9]/g, "") : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  const handleCreateTicket = () => {
    setCreateTicket(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = userDetails.id;
    console.log(userId);

    setFormErrors({});

    try {
      const response = await fetch("/api/show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          Name: formData.showName,
          Type: formData.showType,
          StartDateAndTime: formData.showStartDateAndTime,
          EndDateAndTime: formData.showEndDateAndTime,
          noOfTickets: formData.noOfTickets,
          Mode: showMode,
        }),
      });

      console.log(response, "response");
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();

        if (response.ok) {
          console.log("Show details saved successfully!");
          if (createTicket) {
            route.push(`/user/${userId}/tickets`);
          } else {
            route.push("/success");
          }
        } else {
          if (responseData.errors) {
            const errors: { [key: string]: string } = {};
            responseData.errors.forEach(
              (error: { field: string; message: string }) => {
                errors[error.field] = error.message;
              }
            );
            setFormErrors(errors);
          } else {
            console.error("Error saving show details:", responseData.error);
          }
        }
      } else {
        console.error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
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
            id="showName"
            type="text"
            name="showName"
            value={formData.showName}
            onChange={handleChange}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            label={"Show Name:"}
          />
          {formErrors.showName && (
            <div className="text-red-500 text-sm my-2 font-semibold">
              {formErrors.showName}
            </div>
          )}
        </div>
        <div className="mb-4">
          <InputWithLabel
            id="showType"
            type="text"
            name="showType"
            value={formData.showType}
            onChange={handleChange}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            label="Show Type:"
          />
          {formErrors.showType && (
            <div className="text-red-500 text-sm my-2 font-semibold">
              {formErrors.showType}
            </div>
          )}
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
          {formErrors.showMode && (
            <div className="text-red-500 text-sm my-2 font-semibold">
              {formErrors.showMode}
            </div>
          )}
        </div>
        <div className="mb-4">
          <InputWithLabel
            id="showStartDateAndTime"
            type="datetime-local"
            name="showStartDateAndTime"
            value={formData.showStartDateAndTime}
            onChange={handleChange}
            min={getMinDateTime()}
            className="h-10 w-full rounded-lg border px-4 text-gray-700"
            label="Show Start Date and Time:"
          />
          {formErrors.showStartDateAndTime && (
            <div className="text-red-500 text-sm my-2 font-semibold">
              {formErrors.showStartDateAndTime}
            </div>
          )}
        </div>
        <div className="mb-4">
          <InputWithLabel
            id="showEndDateAndTime"
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
          {formErrors.noOfTickets && (
            <div className="text-red-500 text-sm my-2 font-semibold">
              {formErrors.noOfTickets}
            </div>
          )}
        </div>
        <div className="mb-4 flex justify-center">
          <div className="mr-3">
            <button
              type="submit"
              onClick={handleCreateTicket}
              className="rounded bg-blue-500 px-2 py-2 text-sm text-white hover:bg-blue-700 hover:shadow-lg"
            >
              Create ticket for Show
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="rounded bg-blue-500 px-2 py-2 text-sm text-white hover:bg-blue-700 hover:shadow-lg"
            >
              Skip & Save
            </button>
          </div>
        </div>{" "}
      </form>
    </div>
  );
};

export default ShowInformation;
