import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

interface ErrorResponse {}

// Define the POST handler
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const { email, verificationCode } = await request.json();

    // Validate input
    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    // Find the user with the provided email and verification code
    const user = await db.user.findUnique({
      where: {
        email: email,
        otps: {
          some: {
            otp: verificationCode,
          },
        },
      },
    });

    if (user) {
      // Update user to be verified
      const updateResult = await db.user.update({
        where: { email },
        data: {
          isVerified: true,
          isActive: true,
        },
      });

      // If update was successful, delete OTP
      if (updateResult) {
        await db.userOtp.delete({
          where: { userId: updateResult.id },
        });
        return NextResponse.json(true);
      } else {
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Verification code is incorrect" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error during user verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
