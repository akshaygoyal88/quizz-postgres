import React from "react";
import TestLayout from "./TestLayout";

export default function QuizQuestions({ quizId }: { quizId: string }) {
  return <TestLayout quizId={quizId} />;
}
