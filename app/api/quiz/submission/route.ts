import { db } from '@/db';
import { QuizReportsService } from '@/services';
import { getQuesStatus, questionInitialization } from '@/services/answerSubmission';
import { QuizStatusTypeE } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const reqData = await req.json();

    const statusOfQuiz = await QuizReportsService.getReportByQuizIdAndSubmittedBy({quizId: reqData.quizId, submittedBy: reqData.submittedBy})
    console.log({statusOfQuiz})
    if(statusOfQuiz?.status !== QuizStatusTypeE.INPROGRESS){
      return NextResponse.json({error: 'Your test timed out'});
    }
    const isQueIntialized = await getQuesStatus({setId : reqData.setId,submittedBy:reqData.submittedBy, questionId:reqData.questionId, })
    if(isQueIntialized){
      return NextResponse.json({message: "Already initialized", ques: isQueIntialized });
    }
   
    const initializQuiz = await questionInitialization(reqData);
    return NextResponse.json({message: "Initialized", ques: initializQuiz});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, 500);
  }
}




