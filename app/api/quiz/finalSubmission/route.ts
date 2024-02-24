import { finalTestSubmission } from "@/services/answerSubmission";
import { NextResponse } from "next/server";


export async function POST(req: Request, res: Response){
    const { questions, quizId, submittedBy } =  await req.json();
    const submitRes = await finalTestSubmission({questions, quizId, submittedBy})
    return NextResponse.json(submitRes);
}