import { NextResponse } from "@/node_modules/next/server";
import { deleteAll, deleteNotification, getNotifications, updateNotification } from "@/services/notification";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function GET(req: Request, {params}: {params:Params}) {
    const userId = params.id;
    const res = await getNotifications(userId);
    return NextResponse.json(res);
  }

  export async function DELETE(req: Request, {params}: {params:Params}) {
    const userId = params.id;
    const url = new URL(req.url);
    const notificationId = url.searchParams.get("notificationId");

    if(notificationId){
      const res = await deleteNotification(notificationId);
      return NextResponse.json(res);
    } else {
      const res = await deleteAll(userId);
      return NextResponse.json(res);
    }
    
  }

  export async function PUT(req: Request, {params}: {params:string}) {
    const notificationId = params.id;
    const reqData = await req.json()
    const res = await updateNotification({reqData, notificationId})
    return NextResponse.json(res);
  }