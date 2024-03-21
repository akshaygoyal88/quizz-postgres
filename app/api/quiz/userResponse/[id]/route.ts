import { AnswerSubmisionService } from "@/services";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params:Params}) {
    const quizId = params.id;
    const url = new URL(req.url);
    const submittedBy =  url.searchParams.get("submittedBy");
    const res = await AnswerSubmisionService.getUserQuiz({quizId, submittedBy});
    console.log(res, "sdfdsfdsfdsfdsfdsfdsfdsfdsfd")
    return NextResponse.json(res);
}