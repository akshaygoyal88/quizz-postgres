import { NextResponse } from "@/node_modules/next/server";
import { getNotifications } from "@/services/notification";

export async function GET(req: Request, {params}: {params:string}) {
    const userId = params.id;
    const res = await getNotifications(userId);
    return NextResponse.json(res);
  }