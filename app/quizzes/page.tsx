import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import QuizSets from "@/components/QuizApp/UI/QuizList";
import { getQuestionSets } from "@/services/questionSet";
import { getSessionUser } from "@/utils/getSessionUser";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Quizzes() {
  const userData = await getSessionUser();

  const allQuizzes = await getQuestionSets();
  return (
    <FullWidthLayout>
      <QuizSets allQuizzes={allQuizzes} userData={userData} />
    </FullWidthLayout>
  );
}
