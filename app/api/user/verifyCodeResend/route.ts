import { UserSerivce } from "@/services";
import { NextResponse } from "next/server";


export async function POST(req: Request, res: Response){
    const reqData = await req.json();
   
    const resendRes = await UserSerivce.resendVerficationCode(reqData);
    return NextResponse.json(resendRes);
}