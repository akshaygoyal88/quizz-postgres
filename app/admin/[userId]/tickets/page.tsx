"use client";

import TicketClassification from "@/components/Show/TicketClassification";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: any }) => {
  const [fetchedShowData, setFetchedShowData] = useState<[]>();
  const userId = params.userId;
  const fetchShowInformation = async () => {
    try {
      const response = await fetch(`/api/show?userId=${userId}`, {
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

  return (
    <div>
      <TicketClassification userId={userId} fetchedShowData={fetchedShowData} />
    </div>
  );
};

export default Page;
