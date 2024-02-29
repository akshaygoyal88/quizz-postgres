import { db } from "@/db";
import { getUserById } from "@/services/user";
import { NextResponse } from "next/server";

export async function GET(req:Request,  {params}) {
    const id = params.id;
    const res = await getUserById(id);
    return NextResponse.json(res);
  }
  