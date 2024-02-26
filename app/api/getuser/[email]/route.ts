import { UserSerivce } from "@/services";
import { db } from "@/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { email: string } }) {
  const userEmail: string = params.email;
  if (userEmail) {
    const userData = await UserSerivce.getUserByEmail(userEmail);
    return NextResponse.json(userData);
  }
}
