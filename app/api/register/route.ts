import { NextResponse } from "next/server";

import validator from "validator";
import { db } from "@/db";

import cron from "node-cron";
import { UserSerivce } from "@/Services";

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
  try {
    const { email, password, roleOfUser }: CreateUserRequestBody =
      await request.json();

    const userExist = await UserSerivce.getUserByEmail(email);

    if (userExist) {
      return NextResponse.json({ error: "User already exists.", data: null });
    } else {
      if (validator.isEmail(email)) {
        if (validator.isStrongPassword(password)) {
          const userData = await UserSerivce.registerUser({
            email,
            password,
            roleOfUser
          });
          return NextResponse.json({
            error: null,
            data: userData
          });
        } else {
          return NextResponse.json({
            error:
              "Password must be at least 8 characters./Include at least one lowercase letter./One uppercase letter, one number./One special character.",
            data: null
          });
        }
      } else {
        return NextResponse.json({ error: "Email is not valid.", data: null });
      }
    }
  } catch (err) {
    return NextResponse.json({ error: err.message, data: null });
  }
}

// cron.schedule("* * * * *", async () => {
//   try {
//     const currentDateTime = new Date();
//     await db.userOtp.deleteMany({
//       where: {
//         expirationTime: {
//           lt: currentDateTime
//         }
//       }
//     });
//     console.log("Expired tokens cleaned up successfully.");
//   } catch (error) {
//     console.error("Error cleaning up expired tokens:", error);
//   }
// });
