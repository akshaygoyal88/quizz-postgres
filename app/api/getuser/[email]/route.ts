import { db } from "@/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { email: string } }, req: NextApiRequest) {
  const userEmail: string = decodeURIComponent(params.email);
  console.log(userEmail);

  if (userEmail) {
    const userData = await db.user.findUnique({
      where: { email: userEmail},
    });

    return NextResponse.json(userData);
  }
}
