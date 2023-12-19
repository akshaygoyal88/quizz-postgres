import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  if (request.method === "POST") {
    try {
      const { ticketGroup, quantity, price, description, createdById,showId } =
        await request.json();

        console.log(ticketGroup, quantity, price, description, createdById,showId,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

        const createdTicket = await prisma.tickets.create({
            data: {
              ticketGroup: ticketGroup || null,
              quantity: parseInt(quantity),
              price:parseInt(price),
              description: description || undefined,
              createdBy: {
                connect: { id: createdById },
              },
              show: showId ? { connect: { id: showId } } : undefined,
            },
          });
          

      return new Response(JSON.stringify({ Ticket: createdTicket }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error inserting ticket details:", error);
      return new Response(
        JSON.stringify({ error: "Could not insert ticket details." }),
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
