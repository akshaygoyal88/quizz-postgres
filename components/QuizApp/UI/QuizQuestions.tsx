"use client";

import React from "react";
import TestLayout from "./TestLayout";
import QuizProvider from "@/context/QuizProvider";
import { useSession } from "next-auth/react";

export default function QuizQuestions({ quizId }: { quizId: string }) {
  const ses = useSession();
  if (ses.status === "unauthenticated") {
    return <div>Please signin for quiz.</div>;
  }
  return (
    <QuizProvider>
      <TestLayout quizId={quizId} />
    </QuizProvider>
  );
}
