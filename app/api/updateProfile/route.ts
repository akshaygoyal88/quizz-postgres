import { db } from "@/app/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    const session = await getServerSession();
    const email = session?.user?.email || "";
  
    const newData = await request.json();
    let result;
  
    if (newData.pincode && newData.pincode.length < 6) {
      result = { error: "Pincode should be at least 6 characters." };
    } else {
      const res = await db.user.update({
        where: { email },
        data: {
          ...newData,
        },
      });
      result = res;
    }
  
    if (
      result.mobile_number &&
      result.country &&
      result.state &&
      result.city &&
      result.pincode
    ) {
      const res = await db.user.update({
        where: { email },
        data: {
          isProfileComplete: true,
        },
      });
      result = res;
    }
    return NextResponse.json(result);
  }
  