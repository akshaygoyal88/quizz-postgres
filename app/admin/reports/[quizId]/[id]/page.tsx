import QuizQuesSummary from "@/components/QuizApp/AdminPanel/QuizQuesSummary";
import { getUserQuiz } from "@/services/answerSubmission";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";
import { CandidateResponseTypes } from "@/types/types";
import { getReportByQuizIdAndSubmittedBy } from "@/services/quizReport";
import { QuestionType } from "@prisma/client";

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
  const submittedBy = searchParams?.submittedBy!;
  const quizId = params.quizId;
  const reportId = params.id;
  let marks: { [key: string]: number | boolean } = {};
  const result: CandidateResponseTypes[] = await getUserQuiz({
    quizId,
    submittedBy,
  });
  if (Array.isArray(result)) {
    for (const res of result) {
      const id: string = res.id;
      marks[id] =
        res.question?.type === QuestionType.OBJECTIVE
          ? res.marks
          : res.marks === 0
          ? false
          : res.marks;
    }
  }

  const report = await getReportByQuizIdAndSubmittedBy({
    candidateId: submittedBy,
    quizId,
  });

  return (
    <QuizQuesSummary
      reportId={reportId}
      candidateResponse={result}
      saveMarks={marks}
      reportStatus={report?.quizOwnerStatus!}
    />
  );
}
