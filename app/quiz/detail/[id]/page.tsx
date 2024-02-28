import QuizDetail from "@/components/QuizApp/UI/QuizDetail";
import React from "react";

export default function page({ params }: { params: string }) {
  const quizId: string = params.id;

  return <QuizDetail quizId={quizId} />;
}
