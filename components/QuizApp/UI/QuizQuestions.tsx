"use client";

import React from "react";
import TestLayout from "./TestLayout";
import QuizProvider from "@/context/QuizProvider";

export default function QuizQuestions({ quizId }: { quizId: string }) {
  return (
    <QuizProvider>
      <TestLayout quizId={quizId} />
    </QuizProvider>
  );
}
