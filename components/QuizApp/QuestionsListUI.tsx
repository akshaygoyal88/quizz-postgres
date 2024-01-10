"use client";

import React, { useEffect, useState } from "react";
import QuestionsTable from "./QuestionsTable";
import Link from "next/link";
import Pagination from "../Shared/Pagination";

export default function QuestionsListUI() {
  const [ques, setQues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(0);

  const getAvailableQuestions = async () => {
    try {
      const res = await fetch(`/api/questions?page=${page}&pageSize=9`, {
        method: "GET",
      });

      console.log(res);

      const data = await res.json();

      console.log("listques", data);

      const availableQues = data.questions;

      setTotalPage(data.totalPages);

      setQues([...availableQues]);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   getSetsAndQuestions();
  // }, []);
  useEffect(() => {
    getAvailableQuestions();
  }, [page]);

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    if (Number(pageNumber) > 0 && Number(pageNumber) <= totalpage) {
      setPage(pageNumber);
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-evenly">
        <Link
          href="/quiz/add"
          className="px-4 py-2 font-semibold rounded-sm bg-green-700 text-white"
        >
          Create Set
        </Link>
        <Link
          href="/questions/add"
          className="px-4 py-2 font-semibold rounded-sm bg-blue-700 text-white"
        >
          Add Question
        </Link>
      </div>
      <QuestionsTable
        ques={ques}
        getAvailableQuestions={getAvailableQuestions}
      />
      <Pagination page={page} totalpage={totalpage} paginate={paginate} />
    </div>
  );
}
