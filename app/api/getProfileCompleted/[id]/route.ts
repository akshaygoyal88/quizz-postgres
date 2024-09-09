import { UserSerivce } from "@/services";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Params }) {
  const id = params.id;
  console.log(id);
  const userData: any = await UserSerivce.getUserById(id);
  return NextResponse.json(userData?.isProfileComplete);
}
