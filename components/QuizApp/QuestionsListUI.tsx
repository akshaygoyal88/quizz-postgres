"use client";

import React, { useEffect, useState } from "react";
import QuestionsTable from "./QuestionsTable";
import Link from "next/link";
import Pagination from "../Shared/Pagination";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import Button from "../Shared/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function QuestionsListUI() {
  const [page, setPage] = useState(1);
  const [time, setTime] = useState<Number>(Date.now());
  const router = useRouter();
  const ses = useSession();

  const {
    data: quesData,
    error: quesError,
    isLoading: isLoadingQues,
  } = useFetch({
    url: `${
      pathName.questionsApiPath.path
    }?page=${page}&pageSize=9&createdById=${
      ses.status !== "loading" && ses?.data?.id
    }&time=${time}`,
  });

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    console.log(quesData);
    if (Number(pageNumber) > 0 && Number(pageNumber) <= quesData?.totalPages) {
      console.log(pageNumber);
      setPage(pageNumber);
    }
  };

  const onDelete = () => {
    setTime(Date.now());
  };
  return (
    <div className="">
      <div className="p-1 flex justify-evenly">
        <Button href={`${pathName.questionsAdd.path}`} />
      </div>
      <QuestionsTable
        ques={
          quesData && quesData.questions.length > 0 ? quesData.questions : []
        }
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
