import { UserSerivce } from "@/services";
import { db } from "@/db";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

// export async function GET({ params }: { params: { email: string } }) {
//   const userEmail: string = params.email;
//   if (userEmail) {
//     const userData = await UserSerivce.getUserByEmail(userEmail);
//     return NextResponse.json(userData);
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.pathname.split("/").pop();

    if (email) {
      const userData = await UserSerivce.getUserByEmail(email);

      return NextResponse.json(userData);
    } else {
      return NextResponse.json(
        { error: "Email parameter is missing" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}
