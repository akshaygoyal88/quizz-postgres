import { db } from "@/app/db";

export async function GET(request: Request) {
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const pageSize = parseInt(url.searchParams.get("pageSize") || "1", 10);

      if (!userId) {
        return new Response(
          JSON.stringify({ error: "UserId not provided in the URL" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
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

      if (page > totalPages) {
        return new Response(
          JSON.stringify({ error: "Page number exceeds total pages" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
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

      return new Response(JSON.stringify({ showInformation, totalPages }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error fetching show information:", error);
      return new Response(
        JSON.stringify({ error: "Could not fetch show information." }),
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
