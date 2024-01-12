import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(req:Request,  {params}) {
    const id = params.id;
    console.log(id,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    if (id) {
      const userData = await db.user.findUnique({
        where: { id },
      });
  
      return NextResponse.json(userData);
    }
  }
  