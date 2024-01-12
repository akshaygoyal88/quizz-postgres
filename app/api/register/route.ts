import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import validator from "validator";
import { db } from "@/db";
import { generateUniqueAlphanumericOTP } from "@/app/utils.";
import { UserOtpType } from "@prisma/client";
import cron from "node-cron";

export interface CreateUserRequestBody {
  email: string;
  password: string;
  token: string;
  roleOfUser: any;
}

export interface ErrorResponse {
  userExist?: string;
  password?: string;
  userEmail?: string;
  final?: string;
}

export async function POST(request: Request) {
  let error: ErrorResponse | null = null;
  let data;

  try {
    const { email, password, roleOfUser }: CreateUserRequestBody =
      await request.json();

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    const userExist = await db.user.findUnique({
      where: { email },
    });

    if (userExist) {
      error = { userExist: "User already exists." };
    } else {
      if (validator.isEmail(email)) {
        if (validator.isStrongPassword(password)) {
          const hashedPassword = await hash(password, 10);

          const newOtp = generateUniqueAlphanumericOTP(4);
          const result = await db.user.create({
            data: {
              email,
              password: hashedPassword,
              role: roleOfUser,
              otps: {
                create: {
                  otp: newOtp,
                  type: UserOtpType.REGISTRATION_OTP,
                  expirationTime: expirationTime,
                },
              },
            },
          });
          data = result;
        } else {
          error = {
            password:
              "Password must be at least 8 characters./Include at least one lowercase letter./One uppercase letter, one number./One special character.",
          };
        }
      } else {
        error = { userEmail: "Email is not valid." };
      }
    }
  } catch (err) {
    error = { final: "An error occurred." };
  }

  return NextResponse.json({ error, data });
}

cron.schedule("* * * * *", async () => {
  try {
    const currentDateTime = new Date();
    await db.userOtp.deleteMany({
      where: {
        expirationTime: {
          lt: currentDateTime,
        },
      },
    });
    console.log("Expired tokens cleaned up successfully.");
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
  }
});
