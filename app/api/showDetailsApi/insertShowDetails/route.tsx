import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function POST(request: Request) {
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

      const createdShow = await prisma.show.create({
        data: {
          showName,
          showType,
          showStartDateAndTime: new Date(showStartDateAndTime),
          showEndDateAndTime: new Date(showEndDateAndTime),
          noOfTickets: parseInt(noOfTickets),
          showMode: showMode,
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
