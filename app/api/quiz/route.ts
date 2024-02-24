import { quizInitializationForReport } from "@/services/answerSubmission";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response){
    const {quizId, submittedBy} = await req.json();
    const quizInitializeRes = await quizInitializationForReport(quizId, submittedBy);
    return NextResponse.json( quizInitializeRes);
}