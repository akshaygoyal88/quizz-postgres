import { updateSubscriptionOfUser } from "@/services/quiz";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, {params}: {params: Params}){
    const id = params.id;
    const reqData = await req.json();
    const res = await updateSubscriptionOfUser({id, reqData})
    return NextResponse.json(res);
}