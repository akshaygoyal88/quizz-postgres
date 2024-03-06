import { db } from "@/db";
import { hash } from "bcrypt";
import validator from "validator";

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return sendErrorResponse(res, 405, "Method not allowed");
    }

    const { password, userId, token } = await req.json();

    const otpRecord = await db.userOtp.findFirst({
      where: {
        userId,
        otp: token,
        type: "RESET_TOKEN",
      },
    });

    if (otpRecord && isTokenExpired(otpRecord.createdAt)) {
      return sendErrorResponse(res, 400, "Token expired");
    }

    if (validator.isStrongPassword(password)) {
      const hashedPassword = await hash(password, 10);
      await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      await db.userOtp.delete({
        where: { id: otpRecord.id },
      });

      return sendSuccessResponse(res, { hashedPassword });
    } else {
      const weakPasswordError =
        "Password must include lower & upper case,special characters, and a number..";
      return sendErrorResponse(res, 400, weakPasswordError);
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
}

function isTokenExpired(createdAt) {
  const currentTime = new Date();
  const expiryTime = 10 * 60 * 1000;
  return createdAt.getTime() + expiryTime < currentTime.getTime();
}

function sendSuccessResponse(res, data) {
  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function sendErrorResponse(res, status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
