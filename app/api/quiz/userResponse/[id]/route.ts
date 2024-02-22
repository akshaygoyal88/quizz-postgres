import { AnswerSubmisionService } from "@/services";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params:string}) {
    const setId = params.id;
    const url = new URL(req.url);
    const submittedBy =  url.searchParams.get("submittedBy");
    const res = await AnswerSubmisionService.getUserQuiz({setId, submittedBy});
    return NextResponse.json(res);
}