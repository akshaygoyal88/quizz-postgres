"use client";
import React, { useState } from "react";
import Pagination from "../Shared/Pagination";
import Lable from "../Shared/Lable";
import { Quiz } from "@prisma/client";
import { useSession } from "next-auth/react";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import QuizReportTable from "./QuizReportTable";

export default function AdminReportPage() {
  const ses = useSession();
  const [page, setPage] = useState(1);
  const [time, setTime] = useState<Number>(Date.now());
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const {
    data: quizData,
    error: quizError,
    isLoading: quizLoading,
  } = useFetch({
    url: `${pathName.questionSetApi.path}?createdById=${
      ses.status !== "loading" && ses?.data?.id
    }`,
  });

  const handleSelectQuiz = (id: string) => {
    setSelectedQuiz(id);
  };

  const {
    data: quizReportData,
    error: quizReportError,
    isLoading: quizReportLoading,
  } = useFetch({
    url: `${pathName.adminReportApiRoute.path}/${selectedQuiz}?page=${page}&pageSize=9&time=${time}`,
  });

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    if (
      Number(pageNumber) > 0 &&
      Number(pageNumber) <= quizReportData?.totalPages
    ) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="sm:px-6">
      <SelectQuiz
        defaultValue={""}
        quizzes={quizData}
        handleSelectQuiz={handleSelectQuiz}
      />
      {!selectedQuiz ? (
        <div className="flex flex-col items-center">
          Please select quiz to see report.
        </div>
      ) : (
        <div>
          <QuizReportTable
            quizResByUser={quizReportData?.quizResByUser}
            quizData={quizData}
          />
          <Pagination
            page={page}
            totalpage={quizReportData?.totalPages || 0}
            paginate={paginate}
            totalRows={quizReportData?.totalRows || 0}
          />
        </div>
      )}
    </div>
  );
}

function SelectQuiz({
  defaultValue,
  quizzes,
  handleSelectQuiz,
}: {
  defaultValue: string;
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
