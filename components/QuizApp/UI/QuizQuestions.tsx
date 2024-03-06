"use client";

import React from "react";
import TestLayout from "./TestLayout";
import QuizProvider from "@/context/QuizProvider";
import { useSession } from "next-auth/react";
import { Question } from "@prisma/client";

export default function QuizQuestions({
  allQuestions,
  quizId,
}: {
  allQuestions: Question[];
  quizId: string;
}) {
  const ses = useSession();
  if (ses.status === "unauthenticated") {
    return <div>Please signin for quiz.</div>;
  }
  return (
    <QuizProvider>
      <TestLayout allQuestions={allQuestions} quizId={quizId} />
    </QuizProvider>
  );
}
