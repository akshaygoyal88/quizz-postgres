"use client";

import React from "react";
import Pagination from "../../Shared/Pagination";
import Lable from "../../Shared/Lable";
import { Quiz, UserQuizReport } from "@prisma/client";
import pathName from "@/constants";
import QuizReportList from "./QuizReportList";
import { QuizDetail, UserQuizReportTypes } from "@/types/types";
import { useRouter } from "next/navigation";

export default function AdminReportPage({
  quizData,
  quizId,
  quizReportData,
  totalPages,
  totalRows,
}: {
  quizData: QuizDetail[];
  quizId: string | undefined;
  quizReportData: UserQuizReportTypes[];
  totalPages: number;
  totalRows: number;
}) {
  const router = useRouter();

  const handleSelectQuiz = (id: string) => {
    router.push(`${pathName.adminReportsRoute.path}/${id || undefined}`);
  };

  return (
    <div className="sm:px-6">
      <SelectQuiz
        defaultValue={quizId}
        quizzes={quizData}
        handleSelectQuiz={handleSelectQuiz}
      />
      {quizId === "undefined" ? (
        <div className="flex flex-col items-center">
          Please select quiz to see report.
        </div>
      ) : (
        <>
          <QuizReportList quizResByUser={quizReportData} />
          <Pagination totalpage={totalPages || 0} totalRows={totalRows || 0} />
        </>
      )}
    </div>
  );
}

function SelectQuiz({
  defaultValue,
  quizzes,
  handleSelectQuiz,
}: {
  defaultValue?: string;
  quizzes: Quiz[];
  handleSelectQuiz: (id: string) => void;
}) {
  return (
    <div className="m-4 flex items-center gap-4">
      <Lable labelText="Please select quiz for report:" />
      <select
        className=" border rounded-md p-2"
        defaultValue={defaultValue}
        name="setId"
        onChange={(e) => handleSelectQuiz(e.target.value)}
      >
        <option value="">Select Quiz</option>
        {quizzes &&
          quizzes.map((q: Quiz) =>
            !q.isDeleted ? (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ) : null
          )}
      </select>
    </div>
  );
}
