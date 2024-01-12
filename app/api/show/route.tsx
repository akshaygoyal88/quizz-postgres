import { db } from "@/db";
import { returnResponse } from "@/utils/generateOtp";

export async function GET(request: Request) {
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const pageSize = parseInt(url.searchParams.get("pageSize") || "1", 10);

      if (!userId) {
        return returnResponse(
          { error: "UserId not provided in the URL" },
          400,
          "application/json"
        );
      }

      const totalRows = await db.show.count({
        where: {
          createdBy: {
            id: userId,
          },
        },
      });

      const totalPages = Math.ceil(totalRows / pageSize);

      if (page > totalPages) {
        return returnResponse(
          { error: "Page number exceeds total pages" },
          400,
          "application/json"
        );
      }

      const skip = (page - 1) * pageSize;

      const showInformation = await db.show.findMany({
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

export async function POST(request: Request, response: Response) {
  if (request.method === "POST") {
    try {
      const {
        userId,
        Name,
        Type,
        StartDateAndTime,
        noOfTickets,
        Mode,
        EndDateAndTime,
      } = await request.json();

      const errors = [];
      if (!Name) {
        errors.push({ field: "Name", message: "Show name is required." });
        console.log("Show name is required.");
      }
      if (!Type) {
        errors.push({ field: "Type", message: "Show type is required." });
        console.log("Show type is required.");
      }

      if (!StartDateAndTime) {
        errors.push({
          field: "StartDateAndTime",
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
      if (!Mode) {
        errors.push({ field: "Mode", message: "Show mode is required." });
        console.log("show mode is required");
      }

      if (errors.length > 0) {
        return returnResponse({ errors }, 400, "application/json");
      }

      const startDate = new Date(StartDateAndTime);
      const endDate = EndDateAndTime ? new Date(EndDateAndTime) : null;

      const createdShow = await db.show.create({
        data: {
          Name,
          Type,
          StartDateAndTime: startDate,
          EndDateAndTime: endDate,
          noOfTickets: parseInt(noOfTickets),
          Mode,
          createdBy: {
            connect: { id: userId },
          },
        },
      });

      return returnResponse({ show: createdShow }, 201, "application/json");
    } catch (error) {
      console.error("Error inserting show details:", error);
      return returnResponse({ error: error?.message }, 500, "application/json");
    }
  } else {
    return returnResponse(
      { error: "Method not allowed" },
      405,
      "application/json"
    );
  }
}
