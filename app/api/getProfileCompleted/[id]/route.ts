import { UserSerivce } from "@/services";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params:string}) {
  
  const id = params.id;
  console.log(id)
  const userData = await UserSerivce.getUserById(id);
  return NextResponse.json(userData?.isProfileComplete);
}
