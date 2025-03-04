import { saveResponseForQues } from "@/services/answerSubmission";
import { QuestionType, UserQuizAnswerStatus } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Params }) {
  const id = params?.id;
  try {
    const reqDetail = await req.json();

    if (reqDetail.status === UserQuizAnswerStatus.REVIEW) {
      const reqData: any = {
        id,
        status: UserQuizAnswerStatus.REVIEW,
      };

      const sendRes = await saveResponseForQues(reqData);
      return NextResponse.json(sendRes);
    }

    if (reqDetail.type == QuestionType.OBJECTIVE && !reqDetail.ans_optionsId) {
      const reqData: any = {
        id,
        status: UserQuizAnswerStatus.SKIPPED,
        timeOver: reqDetail.timeOver,
        timeTaken: reqDetail.timeTaken,
      };

      const sendRes = await saveResponseForQues(reqData);
      return NextResponse.json(sendRes);
    }
    if (
      reqDetail.type == QuestionType.SUBJECTIVE &&
      !reqDetail.ans_subjective
    ) {
      const reqData: any = {
        id,
        status: UserQuizAnswerStatus.SKIPPED,
        timeOver: reqDetail.timeOver,
        timeTaken: reqDetail.timeTaken,
      };
      const sendRes = await saveResponseForQues(reqData);
      return NextResponse.json(sendRes);
    }
    if (reqDetail) {
      const reqData: any = {
        id,
        ans_optionsId: reqDetail.ans_optionsId,
        ans_subjective: reqDetail.ans_subjective,
        status: UserQuizAnswerStatus.ATTEMPTED,
        timeOver: reqDetail.timeOver,
        timeTaken: reqDetail.timeTaken,
      };
      const sendRes = await saveResponseForQues(reqData);
      return NextResponse.json(sendRes);
    }
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
