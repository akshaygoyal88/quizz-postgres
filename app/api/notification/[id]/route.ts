import { NextResponse } from "@/node_modules/next/server";
import { deleteAll, getNotifications } from "@/services/notification";

export async function GET(req: Request, {params}: {params:string}) {
    const userId = params.id;
    const res = await getNotifications(userId);
    return NextResponse.json(res);
  }

  export async function DELETE(req: Request, {params}: {params:string}) {
    const userId = params.id;
    const res = await deleteAll(userId);
    return NextResponse.json(res);
  }