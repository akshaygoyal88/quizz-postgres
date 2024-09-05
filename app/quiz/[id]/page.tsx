import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import QuizDetail from "@/components/QuizApp/UI/QuizDetail";
import pathName from "@/constants";
import { QuizService, UserSerivce } from "@/services";
import { getFirstQuesIdOfQuiz } from "@/services/questionSet";
import { getQuizReportStatusOfCandidate } from "@/services/quizReport";
import { QuizDetailType, UserDataType } from "@/types/types";
import { Quiz, QuizCreationStatusE, Subscription, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: { params: Params }) {
  const session = await getServerSession();
  const quizId: string = params.id;

  const userData: UserDataType | null = await UserSerivce.getUserByEmail(
    session?.user?.email || ""
  );

  const firstQuesId = await getFirstQuesIdOfQuiz(quizId);
  const quizDetails: QuizDetailType = await QuizService.getQuizDetailByQuizId(
    quizId
  );

  const isCandidateSubscribed =
    quizDetails.status === QuizCreationStatusE.FREE
      ? true
      : userData?.Subscription.find(
          (sub: Subscription) => sub.quizId === quizId
        );

  const quizStatus = await getQuizReportStatusOfCandidate({
    candidateId: userData?.id,
    quizId,
  });

  return (
    <FullWidthLayout>
      <QuizDetail
        quizId={quizId}
        firstQuesId={firstQuesId}
        quizDetails={quizDetails}
        userData={userData}
        isCandidateSubscribed={isCandidateSubscribed}
        isDone={!!quizStatus}
      />
    </FullWidthLayout>
  );
}
