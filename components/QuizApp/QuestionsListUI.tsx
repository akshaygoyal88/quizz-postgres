"use client";

import React, { useEffect, useState } from "react";
import QuestionsTable from "./QuestionsTable";
import Link from "next/link";
import Pagination from "../Shared/Pagination";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";

export default function QuestionsListUI() {
  const [ques, setQues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(0);
  const [time, setTime] = useState<Number>(Date.now());

  const {
    data: quesData,
    error: quesError,
    isLoading: isLoadingQues,
  } = useFetch(
    `${pathName.questionsApiPath.path}?page=${page}&pageSize=9`,
    time
  );

  useEffect(() => {
    if (quesData) {
      const availableQues = quesData.questions;
      setTotalPage(quesData.totalPages);
      setQues([...availableQues]);
    }
  }, [quesData]);

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    if (Number(pageNumber) > 0 && Number(pageNumber) <= totalpage) {
      setPage(pageNumber);
    }
  };
  const onDelete = () => {
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
          href={`${pathName.questionsAdd.path}`}
          className="px-4 py-2 font-semibold rounded-sm bg-blue-700 text-white"
        >
          Add Question
        </Link>
      </div>
      <QuestionsTable
        ques={ques}
        // getAvailableQuestions={getAvailableQuestions}
        onDelete={onDelete}
      />
      <Pagination
        page={page}
        totalpage={quesData?.totalPages || 0}
        paginate={paginate}
        totalRows={quesData?.totalRows || 0}
      />
    </div>
  );
}
