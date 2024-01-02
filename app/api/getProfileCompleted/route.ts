import { db } from "@/app/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
  const session = await getServerSession();
  let isProfileComplete;

  if (session && session.user) {
    const email = session.user.email;
    if (email) {
      const userData = await db.user.findUnique({
        where: { email },
      });
      isProfileComplete = userData?.isProfileComplete;
    }
  }

  return NextResponse.json(isProfileComplete);
}
