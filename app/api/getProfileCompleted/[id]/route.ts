import { UserSerivce } from "@/services";
import { NextResponse } from "next/server";

export async function GET({ params }) {
  const id = params.id;
  const userData = await UserSerivce.getUserById(id);
  return NextResponse.json(userData?.isProfileComplete);
}
