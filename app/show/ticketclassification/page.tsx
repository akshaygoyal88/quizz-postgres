'use client'

import TicketClassification from "@/components/Show/TicketClassification";
import { PrismaClient } from "@prisma/client";
import React, { useEffect, useState } from "react";

const Page = () => {


  const [fetchedShowData, setFetchedShowData] = useState<[]>();
const userId = "clq511pdy0000op42iuzmwsej"
  const fetchShowInformation = async () => {
    try {
      
      const response = await fetch(`/api/showDetailsApi/getShowDetails?userId=${userId}`, {
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
      <TicketClassification fetchedShowData={fetchedShowData} />
    </div>
  );
};








export default Page;
