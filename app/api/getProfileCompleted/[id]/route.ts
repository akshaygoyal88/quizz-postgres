import { db } from "@/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET({params}) {
const id = params.id
console.log("idddddddddddd",id)
let isProfileComplete;
    if (id) {
      const userData = await db.user.findUnique({
        where: { id },
      });
      isProfileComplete = userData?.isProfileComplete;
      console.log(userData)
    }
  
  return NextResponse.json(isProfileComplete);
}
