import { db } from "@/db";
import { returnResponse } from "@/utils/returnResponse";


export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return returnResponse(
      { error: "Email not provided" },
      400,
      "application/json"
    );
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return returnResponse({ user }, 200, "application/json");
    } else {
      return returnResponse(
        { error: "User not found." },
        404,
        "application/json"
      );
    }
  } catch (error) {
    return returnResponse(
      { error: "Internal Server Error" },
      500,
      "application/json"
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const emailToDelete = url.searchParams.get("email");

  if (!emailToDelete) {
    return returnResponse(
      { error: "Email not provide" },
      400,
      "application/json"
    );
  }

  try {
    const user = await db.user.findUnique({
      where: { email: emailToDelete },
    });

    if (user) {
      const deleteRes = await db.user.delete({
        where: { email: emailToDelete },
      });

      if (deleteRes) {
        return returnResponse({ success: true }, 200, "application/json");
      } else {
        return returnResponse(
          { error: "Failed to delete user" },
          500,
          "application/json"
        );
      }
    } else {
      return returnResponse(
        { error: "User not found" },
        404,
        "application/json"
      );
    }
  } catch (error) {
    console.error("Error during user deletion:", error);
    return returnResponse(
      { error: "Internal Server Error" },
      505,
      "application/json"
    );
  }
}
