
import { db } from "@/app/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface ErrorResponse {
  }

export async function POST(request: {
  json: () =>
    | PromiseLike<{ email: any; verificationCode: any }>
    | { email: any; verificationCode: any };
}) {
  const { email, verificationCode } = await request.json();

  let error: ErrorResponse | null = null;
  let data;

  try {
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
    console.log(user);

    if (user) {
      const res = await db.user.update({
        where: { email },
        data: {
          isVerified: true,
          isActive: true,
        },
      });

      if (res) {
        const deleteRes = await db.userOtp.delete({
          where: { userId: res.id },
        });
        return NextResponse.json(true);
      } else {
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "User not found or verification code is incorrect" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error during user verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}