import QuestionsList from "@/components/QuizApp/AdminPanel/QuestionsList";
import { getAllQuestions } from "@/services/questions";
import { getSessionUser } from "@/utils/getSessionUser";
import React from "react";

export default async function Questions({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    pageSize?: string;
  };
}) {
  const userData = await getSessionUser();
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 9;
  const skip = (page - 1) * pageSize;
  const createdById = userData?.id!;
  const result = await getAllQuestions({ createdById, pageSize, skip });

  return (
    <QuestionsList
      quesData={result.questions}
      totalPages={result.totalPages}
      totalRows={result.totalRows}
    />
  );
}
