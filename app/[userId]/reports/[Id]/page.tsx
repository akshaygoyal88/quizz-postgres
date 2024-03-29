import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import QuizReport from "@/components/QuizApp/UI/QuizReport";
import pathName from "@/constants";
import { redirect } from "@/node_modules/next/navigation";
import { getUserQuiz } from "@/services/answerSubmission";
import {
  getQuizReportOfUser,
  getQuizsByAttemptedByUser,
} from "@/services/quizReport";
import { getSessionUser } from "@/utils/getSessionUser";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: Params) {
  const userData = await getSessionUser();
  if (!userData) {
    redirect(pathName.login.path);
  }
  const userId = params.userId;
  const quizId = params.Id;

  const quizList = await getQuizsByAttemptedByUser(userId);
  const quizzes = quizList.quizzes;

  const reportOfUser = await getQuizReportOfUser({
    submittedBy: userId,
    quizId: quizId,
  });

  const candidateResponse = await getUserQuiz({
    submittedBy: userId,
    quizId: quizId,
  });
  return (
    <FullWidthLayout>
      <QuizReport
        userId={userId}
        attempetdQuiz={quizzes}
        quizId={quizId}
        dataOfSelectedQuiz={reportOfUser}
        candidateResponse={candidateResponse}
      />
    </FullWidthLayout>
  );
}
