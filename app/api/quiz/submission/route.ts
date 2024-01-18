import { db } from '@/db';
import { getQuesStatus, questionInitialization } from '@/services/answerSubmission';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const reqData = await req.json();
    console.log(reqData)
    const isQueIntialized = await getQuesStatus({setId : reqData.setId,submittedBy:reqData.submittedBy, questionId:reqData.questionId, })
    console.log(isQueIntialized);
    if(isQueIntialized){
      return NextResponse.json({message: "Already initialized", ques: isQueIntialized });
    }
   
    const initializQuiz = await questionInitialization(reqData);
    return NextResponse.json({message: "Initialized", ques: initializQuiz});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, 500);
  }
}




