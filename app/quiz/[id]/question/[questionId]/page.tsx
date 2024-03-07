import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import TestLayout from "@/components/QuizApp/UI/TestLayout";
import { userQuizQuestionInitilization } from "@/services/answerSubmission";
import { getQuizQuestions, getUserQuizQuestionsAnswers } from "@/services/quiz";
import { getUserByEmail } from "@/services/user";
import { QuizQuestions } from "@prisma/client";
import { getServerSession } from "next-auth";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: { params: Params }) {
  const session = await getServerSession();
  const userData = await getUserByEmail(session?.user?.email ?? "");
  if (!userData) {
    return <>Not authenticated</>;
  }

  const quizId = params.id;
  const questionId = params.questionId;
  const allQuestions = await getUserQuizQuestionsAnswers({
    quizId,
    userId: userData?.id,
  });

  const userQuizQuestionWithAnswer = await userQuizQuestionInitilization({
    submittedBy: userData?.id,
    quizId,
    questionId,
  });
  const index = allQuestions.findIndex((que) => que.id === questionId);

  if (allQuestions.length > 0) {
    return (
      <FullWidthLayout>
        <TestLayout
          allQuestions={allQuestions}
          quizId={params?.id}
          nextId={index >= 0 && allQuestions[index + 1]?.id}
          prevId={index > 0 && allQuestions[index - 1]?.id}
          userQuizQuestionWithAnswer={userQuizQuestionWithAnswer}
          userData={userData}
        />
      </FullWidthLayout>
    );
  } else {
    return <>ERROR COMPONENT</>;
  }
}
