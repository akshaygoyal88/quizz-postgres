"use client";

import React, { useState } from "react";
import QuizTable from "./QuizTable";
import Link from "next/link";
import Pagination from "../Shared/Pagination";
import { FetchMethodE, useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";

export default function QuizCreation() {
  const [page, setPage] = useState(1);
  const [time, setTime] = useState<Number>(Date.now());
  const { data, error, isLoading } = useFetch({
    url: `${pathName.questionSetApi.path}?page=${page}&pageSize=9&time=${time}`,
    method: FetchMethodE.GET,
  });
  const paginate = (pageNumber: React.SetStateAction<number>) => {
    console.log(pageNumber);
    if (Number(pageNumber) > 0 && Number(pageNumber) <= data?.totalPages) {
      setPage(pageNumber);
    }
  };
  const onDelete = () => {
    console.log("deleted");
    setTime(Date.now());
  };

  return (
    <div className="p-4">
      <div className="flex justify-evenly">
        <Link
          href={`${pathName.quizAdd.path}`}
          className="px-4 py-2 font-semibold rounded-sm bg-green-700 text-white"
        >
          Create Set
        </Link>
        <Link
          href={`${pathName.questions.path}`}
          className="px-4 py-2 font-semibold rounded-sm bg-blue-400 text-white"
        >
          Questions List
        </Link>
        <Link
          href={`${pathName.questionsAdd.path}`}
          className="px-4 py-2 font-semibold rounded-sm bg-blue-700 text-white"
        >
          Add Question
        </Link>
      </div>
      <QuizTable
        key={time}
        queSets={data?.questionSets || []}
        // getSetsAndQuestions={() => {}}
        onDelete={onDelete}
      />
      <Pagination
        page={page}
        totalpage={data?.totalPages || 0}
        paginate={paginate}
        totalRows={data?.totalRows || 0}
      />
    </div>
  );
}
