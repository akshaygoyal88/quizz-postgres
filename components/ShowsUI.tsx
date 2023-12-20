"use client";
import React, { useState } from "react";
import ShowCard from "./Shared/ShowCard";

export default function ShowsUI() {
  const [shows, setShows] = useState([
    {
      id: "1",
      showName: "Breaking Bad",
      showType: "Drama",
      showMode: "Weekly",
      showStartDateAndTime: "2023-01-01T18:00:00Z",
      showEndDateAndTime: "2023-01-01T20:00:00Z",
      noOfTickets: 100,
      createdById: "user1",
    },
    {
      id: "2",
      showName: "Stranger Things",
      showType: "Science Fiction",
      showMode: "Daily",
      showStartDateAndTime: "2023-02-01T20:00:00Z",
      showEndDateAndTime: "2023-02-01T22:00:00Z",
      noOfTickets: 150,
      createdById: "user2",
    },
    {
      id: "1",
      showName: "Breaking Bad",
      showType: "Drama",
      showMode: "Weekly",
      showStartDateAndTime: "2023-01-01T18:00:00Z",
      showEndDateAndTime: "2023-01-01T20:00:00Z",
      noOfTickets: 100,
      createdById: "user1",
    },
    {
      id: "2",
      showName: "Stranger Things",
      showType: "Science Fiction",
      showMode: "Daily",
      showStartDateAndTime: "2023-02-01T20:00:00Z",
      showEndDateAndTime: "2023-02-01T22:00:00Z",
      noOfTickets: 150,
      createdById: "user2",
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-4">TV Shows</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
