"use client";

import React, { useState } from "react";
import QuizSetCard from "./QuizSetCard";
import { Quiz } from "@prisma/client";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function QuizSets() {
  const questionSets: Quiz[] = [];
  const ses = useSession();

  const { data, error, isLoading } = useFetch({
    url: `${pathName.questionSetApi.path}`,
  });

  const getQuestionCount = (questionSet: Quiz): number => {};

  const userId = ses?.data?.id;

  return (
    <>
      <Link
        href={`/quizzes/reports/${userId}`}
        className="mx-4 px-4 py-2 bg-yellow-300 rounded-md flex items-center w-fit text-blue-700 hover:underline"
      >
        See Your Reports
      </Link>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      >
        {data &&
          data.map((quiz: Quiz) => (
            <QuizSetCard
              key={quiz.id}
              quiz={quiz}
              submittedBy={userId}

              // questionCount={getQuestionCount(questionSet)}
            />
          ))}
      </ul>
    </>
  );
}
