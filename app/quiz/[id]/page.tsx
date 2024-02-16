import QuizQuestions from "@/components/QuizApp/UI/QuizQuestions";
import React from "react";

export default function QuizTestPage({ params }: { params: string }) {
  return <QuizQuestions quizId={params.id} />;
}
