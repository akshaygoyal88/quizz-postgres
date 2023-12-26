import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function POST(request: Request, response: Response) {
  if (request.method === "POST") {
    try {
      const {
        userId,
        showName,
        showType,
        showStartDateAndTime,
        noOfTickets,
        showMode,
        showEndDateAndTime,
      } = await request.json();

      const errors = [];
      if (!showName) {
        errors.push({ field: "showName", message: "Show name is required." });
        console.log("Show name is required.");
      }
      if (!showType) {
        errors.push({ field: "showType", message: "Show type is required." });
        console.log("Show type is required.");
      }

      if (!showStartDateAndTime) {
        errors.push({
          field: "showStartDateAndTime",
          message: "Show start date and time is required.",
        });
        console.log("show start and time is required.");
      }

      if (
        !noOfTickets ||
        isNaN(parseInt(noOfTickets)) ||
        parseInt(noOfTickets) <= 0
      ) {
        errors.push({
          field: "noOfTickets",
          message: "Number of tickets must be a positive integer.",
        });

        console.log("number of tickets must be a positive");
      }
      if (!showMode) {
        errors.push({ field: "showMode", message: "Show mode is required." });
        console.log("show mode is required");
      }

      if (errors.length > 0) {
        return new Response(JSON.stringify({ errors }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const startDate = new Date(showStartDateAndTime);
      const endDate = showEndDateAndTime ? new Date(showEndDateAndTime) : null;

      const createdShow = await prisma.show.create({
        data: {
          showName,
          showType,
          showStartDateAndTime: startDate,
          showEndDateAndTime: endDate,
          noOfTickets: parseInt(noOfTickets),
          showMode,
          createdBy: {
            connect: { id: userId },
          },
        },
      });

      return new Response(JSON.stringify({ show: createdShow }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error inserting show details:", error);
      return new Response(
        JSON.stringify({ error: "Could not insert show details." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } else {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
