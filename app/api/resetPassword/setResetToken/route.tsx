import { db } from "@/app/db";
import { request } from "http";

export async function POST(req, res) {
  if (req.method === "POST") {
    try {
      const { userId, otp, type } = await req.json();

      const existingUserOtp = await db.userOtp.findUnique({
        where: { userId },
      });

      if (existingUserOtp) {
        const updatedUserOtp = await db.userOtp.update({
          where: { userId },
          data: { otp, type },
        });

        return new Response(JSON.stringify({ updatedUserOtp }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        const newUserOtp = await db.userOtp.create({
          data: { userId, otp, type },
        });

        return new Response(JSON.stringify({ newUserOtp }), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error inserting/updating data:", error);
      return new Response(
        JSON.stringify({
          error: "Could not insert/update Reset Token otp details.",
        }),
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
