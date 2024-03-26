import AdminReportPage from "@/components/QuizApp/AdminPanel/AdminReportPage";
import { getQuizzesByCreatedBy } from "@/services/questionSet";
import { getReportsByQuizId } from "@/services/quizReport";
import { getSessionUser } from "@/utils/getSessionUser";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: {
    query?: string;
    page?: string;
    pageSize?: string;
  };
}) {
  const quizId = params.quizId;
  const userData = await getSessionUser();
  const quizData = await getQuizzesByCreatedBy(userData?.id);

  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 9;
  const skip = (page - 1) * pageSize;

  const result = await getReportsByQuizId({ skip, pageSize, quizId });

  return (
    <AdminReportPage
      quizId={quizId}
      quizData={quizData}
      quizReportData={result.quizResByUser}
      totalPages={result.totalPages}
      totalRows={result.totalRows}
    />
  );
}
