import QuizDetail from "@/components/QuizApp/UI/QuizDetail";
import { getFirstQuesIdOfQuiz } from "@/services/questionSet";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: { params: Params }) {
  const quizId: string = params.id;
  const firstQuesId = await getFirstQuesIdOfQuiz(quizId);
  return <QuizDetail quizId={quizId} firstQuesId={firstQuesId} />;
}
