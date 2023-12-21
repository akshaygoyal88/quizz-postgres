import { db } from "@/app/db";

interface TicketData {
  ticketGroup?: string;
  quantity: number;
  price: number;
  description?: string;
  createdById: string;
  showId?: string;
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const requestData: TicketData[] = await request.json();

    const errors = [];

    requestData.forEach((ticket, index) => {
      if (!ticket.quantity) {
        errors.push({
          index: index,
          field: "quantity",
          message: `Quantity required. `,
        });
      }

      if (!ticket.price) {
        errors.push({
          index: index,
          field: "price",
          message: `Price required. `,
        });
      }
    });

    if (errors.length > 0) {
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const createdTickets = await Promise.all(
      requestData.map(async (ticketData) => {
        const {
          ticketGroup,
          quantity,
          price,
          description,
          createdById,
          showId,
        } = ticketData;

        const createdTicket = await db.tickets.create({
          data: {
            ticketGroup: ticketGroup || null,
            quantity: Number(quantity),
            price: Number(price),
            description: description || undefined,
            createdBy: {
              connect: { id: createdById },
            },
            show: showId ? { connect: { id: showId } } : undefined,
          },
        });

        return createdTicket;
      })
    );

    return new Response(JSON.stringify({ Tickets: createdTickets }), {
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
}
