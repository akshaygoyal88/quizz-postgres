import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import validator from "validator";
import { db } from "@/app/db";

interface CreateUserRequestBody {
  email: string;
  password: string;
  token: string;
}

interface ErrorResponse {
  userExist?: string;
  password?: string;
  userEmail?: string;
  final?: string;
}

export async function POST(request: Request) {
  let error: ErrorResponse | null = null;
  let data;

  try {
    const { email, password, token }: CreateUserRequestBody = await request.json();

    const userExist = await db.user.findUnique({
      where: { email },
    });

    if (userExist) {
      error = { userExist: "User already exists." };
    } else {
      if (validator.isEmail(email)) {
        if (validator.isStrongPassword(password)) {
          const hashedPassword = await hash(password, 10);
          const roleUser = "USER";

          const result = await db.user.create({
            data: {
              email,
              password: hashedPassword,
              role: roleUser,
              otps: {
                create: {
                  otp: token,
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
    console.error(err);
    error = { final: "An error occurred." };
  }

  return NextResponse.json({ error, data });
}
