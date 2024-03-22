import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import QuizReport from "@/components/QuizApp/UI/QuizReport";
import { getUserQuiz } from "@/services/answerSubmission";
import {
  getQuizReportOfUser,
  getQuizsByAttemptedByUser,
} from "@/services/quizReport";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: Params) {
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
