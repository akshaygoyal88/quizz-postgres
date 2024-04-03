import { QuizService } from "@/services";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params:Params}){
    const quizId = params?.quizId;
    const res = await QuizService.getQuizDetailByQuizId(quizId);
    return NextResponse.json(res);
}