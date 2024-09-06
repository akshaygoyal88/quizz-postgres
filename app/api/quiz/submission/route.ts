import { db } from "@/db";
import { QuizReportsService } from "@/services";
// import {
//   getQuesStatus,
//   questionInitialization,
// } from "@/services/answerSubmission";
import { UserQuizStatusE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const reqData = await req.json();

    const statusOfQuiz =
      await QuizReportsService.getReportByQuizIdAndSubmittedBy({
        quizId: reqData.quizId,
        submittedBy: reqData.submittedBy,
      });

    if (statusOfQuiz?.status !== UserQuizStatusE.INPROGRESS) {
      return NextResponse.json({ error: "Your test timed out" });
    }

    // const isQueIntialized = await getQuesStatus({
    //   quizId: reqData.quizId,
    //   submittedBy: reqData.submittedBy,
    //   questionId: reqData.questionId,
    // });
    // if (isQueIntialized) {
    //   return NextResponse.json({
    //     message: "Already initialized",
    //     ques: isQueIntialized,
    //   });
    // }

    // const initializQuiz = await questionInitialization(reqData);
    return NextResponse.json({ message: "Initialized", ques: "initializQuiz" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, 500);
  }
}
