import { saveResponseForQues } from "@/services/answerSubmission";
import { QuestionType, UserQuizAnswerStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: string }) {
  const id = params?.id;
  try {
    const reqDetail = await req.json();

    if(reqDetail.status === UserQuizAnswerStatus.REVIEW){
        const sendRes = await saveResponseForQues({
            id,
            reqData: {
              status: UserQuizAnswerStatus.REVIEW,
            },
          });
          return NextResponse.json(sendRes);
    }
   
    if (reqDetail.type == QuestionType.OBJECTIVE && !reqDetail.ans_optionsId) {
      const sendRes = await saveResponseForQues({
        id,
        reqData: {
          isAnswered: false,
          status: UserQuizAnswerStatus.SKIPPED,
          timeOver: reqDetail.timeOver,
          timeTaken: reqDetail.timeTaken,
        },
      });
      return NextResponse.json(sendRes);
    }
    if (
      reqDetail.type == QuestionType.SUBJECTIVE &&
      !reqDetail.ans_subjective
    ) {
      const sendRes = await saveResponseForQues({
        id,
        reqData: {
          isAnswered: false,
          status: UserQuizAnswerStatus.SKIPPED,
          timeOver: reqDetail.timeOver,
          timeTaken: reqDetail.timeTaken,
        },
      });
      return NextResponse.json(sendRes);
    }
    if (reqDetail) {
      const sendRes = await saveResponseForQues({
        id,
        reqData: {
          ans_optionsId: reqDetail.ans_optionsId,
          ans_subjective: reqDetail.ans_subjective,
          isAnswered: true,
          status: UserQuizAnswerStatus.ATTEMPTED,
          timeOver: reqDetail.timeOver,
          timeTaken: reqDetail.timeTaken,
        },
      });
      return NextResponse.json(sendRes);
    }
   
    
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
