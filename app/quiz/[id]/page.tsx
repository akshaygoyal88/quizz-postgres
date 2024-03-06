import QuizQuestions from "@/components/QuizApp/UI/QuizQuestions";
import { getQuizQuestions } from "@/services/quiz";
import React from "react";

export default async function QuizTestPage({ params }: { params: string }) {
  const allQuestions = await getQuizQuestions({ quizId: params.id });
  return <QuizQuestions allQuestions={allQuestions} quizId={params.id} />;
}
