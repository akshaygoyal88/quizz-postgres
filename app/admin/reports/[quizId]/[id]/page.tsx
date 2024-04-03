import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizQuesSummary from "@/components/QuizApp/AdminPanel/QuizQuesSummary";
import { getUserQuiz } from "@/services/answerSubmission";
import { isUnauthorised } from "@/utils/isUnauthorised";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";
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
  const quizId = searchParams?.quizId!;
  const submittedBy = searchParams?.submittedBy!;
  const reportId = params.id;
  let marks: { [key: string]: number } = {};
  const result = await getUserQuiz({ quizId, submittedBy });
  if (result?.length > 0) {
    for (const res of result) {
      const id: string = res.id;

      const correctOption = res.question.objective_options.find(
        (o) => o.isCorrect
      );
      console.log(res);
      const mark =
        res.marks === 0
          ? res?.question?.type === QuestionType.OBJECTIVE
            ? res.ans_optionsId === correctOption?.id
              ? 1
              : 0
            : 0
          : res.marks;
      marks[id] = mark;
      // setMarks((prevMarks) => ({
      //   ...prevMarks,
      //   [id]: mark,
      // }));
    }
  }
  console.log(marks);
  return (
    <QuizQuesSummary
      reportId={reportId}
      candidateResponse={result}
      saveMarks={marks}
    />
  );
}
