"use client";

import React, { useEffect, useState } from "react";
import QuizTable from "./QuizTable";
import Link from "next/link";
import Pagination from "../Shared/Pagination";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";
import { useSession } from "next-auth/react";
import EmptyState from "../Shared/EmptyState";

export default function QuizCreation() {
  const [page, setPage] = useState(1);
  const [time, setTime] = useState<Number>(Date.now());
  const ses = useSession();
  const { data, error, isLoading } = useFetch({
    url: `${pathName.questionSetApi.path}?page=${page}&pageSize=9&createdById=${
      ses.status !== "loading" && ses?.data?.id
    }&time=${time}`
  });

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    if (Number(pageNumber) > 0 && Number(pageNumber) <= data?.totalPages) {
      setPage(pageNumber);
    }
  };

  const onDelete = () => {
    setTime(Date.now());
  };

  return (
    <div className="p-4">
      {data?.questionSets.length > 0 ? (
        <QuizTable
          queSets={data?.questionSets || []}
          // getSetsAndQuestions={() => {}}
          onDelete={onDelete}
        />
      ) : (
        <EmptyState
          title="Set"
          description="No set found"
          buttonLink={pathName.quizAdd.path}
          buttonText="Create set"
        />
      )}
      {data?.totalRows > 10 && (
        <Pagination
          page={page}
          totalpage={data?.totalPages || 0}
          paginate={paginate}
          totalRows={data?.totalRows || 0}
        />
      )}
    </div>
  );
}
