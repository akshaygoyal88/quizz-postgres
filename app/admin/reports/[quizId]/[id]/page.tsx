import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizQuesSummary from "@/components/QuizApp/AdminPanel/QuizQuesSummary";
import { getUserQuiz } from "@/services/answerSubmission";
import { isUnauthorised } from "@/utils/isUnauthorised";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: {
    quizId?: string;
    submittedBy?: string;
    reportStatus?: string;
  };
}) {
  const quizId = searchParams?.quizId!;
  const submittedBy = searchParams?.submittedBy!;
  const reportId = params.id;
  const result = await getUserQuiz({ quizId, submittedBy });
  return <QuizQuesSummary reportId={reportId} candidateResponse={result} />;
}
