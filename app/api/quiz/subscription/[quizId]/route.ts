import { QuizService } from '@/services';
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: string }){
    const quizId = params.quizId;
    const res = await QuizService.getSubscribersByQuizId(quizId);
    return NextResponse.json(res)
  
}
