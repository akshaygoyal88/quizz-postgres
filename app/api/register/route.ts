import { NextResponse } from "next/server";

import validator from "validator";
import { UserSerivce, NotificationService } from "@/services";

export interface CreateUserRequestBody {
  email: string;
  password: string;
  token: string;
  roleOfUser: any;
  confirmPassword?: string;
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
    const { email, password, roleOfUser, confirmPassword }: CreateUserRequestBody =
      await request.json();

    const userExist = await UserSerivce.getUserByEmail(email);

    if (userExist) {
      return NextResponse.json({ error: "User already exists.", data: null });
    } else {
      if (validator.isEmail(email)) {
        if (validator.isStrongPassword(password)) {
          const userData: any = await UserSerivce.registerUser({
            email,
            password,
            roleOfUser,
            confirmPassword
          });
          if(userData){
            const regNotification = await NotificationService.createNotification({userId: userData.id, message: "This is to confirm that your account with [Your Platform Name] has been successfully registered."})
          }
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
    console.error(err)
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
