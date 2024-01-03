import { db } from "@/app/db";
import { returnResponse } from "@/app/utils.";

interface TicketData {
  ticketGroup?: string;
  quantity: number;
  price: number;
  description?: string;
  createdById: string;
  showId?: string;
}

export async function GET(request: Request) {
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const pageSize = parseInt(url.searchParams.get("pageSize") || "1", 10);

      console.log("page = ", page, "page size: = ", pageSize);

      if (!userId) {
        return returnResponse(
          { error: "UserId not provided in the URL" },
          400,
          "application/json"
        );
      }

      const totalRows = await db.tickets.count({
        where: {
          createdBy: {
            id: userId,
          },
        },
      });

      const totalPages = Math.ceil(totalRows / pageSize);

      console.log("totalPages = ", totalPages);

      if (page > totalPages) {
        return returnResponse(
          { error: "Page number exceeds total pages" },
          400,
          "application/json"
        );
      }

      const skip = (page - 1) * pageSize;

      const showInformation = await db.tickets.findMany({
        where: {
          createdBy: {
            id: userId,
          },
        },
        skip,
        take: pageSize,
      });

      return returnResponse(
        { showInformation, totalPages },
        200,
        "application/json"
      );
    } catch (error) {
      console.error("Error fetching show information:", error);
      return returnResponse(
        { error: "Could not fetch show information." },
        500,
        "application/json"
      );
    }
  } else {
    return returnResponse(
      { error: "Method not allowed" },
      405,
      "application/json"
    );
  }
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return returnResponse(
      { error: "Method not allowed" },
      405,
      "application/json"
    );
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
      return returnResponse({ errors }, 400, "application/json");
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

    return returnResponse({ Tickets: createdTickets }, 201, "application/json");
  } catch (error) {
    console.error("Error inserting ticket details:", error);

    return returnResponse({ error: error?.message }, 500, "application/json");
  }
}
