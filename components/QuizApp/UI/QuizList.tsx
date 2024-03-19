"use client";

import React, { useState } from "react";
import QuizSetCard from "./QuizSetCard";
import Link from "next/link";
import { QuizDetail, UserDataType } from "@/types/types";

export default function QuizList({
  allQuizzes,
  userData,
}: {
  allQuizzes: QuizDetail[];
  userData: UserDataType | null;
}) {
  return (
    <>
      <Link
        href={`/quizzes/reports/${userData?.id}`}
        className="mx-4 px-4 py-2 bg-yellow-300 rounded-md flex items-center w-fit text-blue-700 hover:underline"
      >
        See Your Reports
      </Link>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      >
        {allQuizzes &&
          allQuizzes.map((quiz: QuizDetail) => (
            <QuizSetCard key={quiz.id} quiz={quiz} userData={userData} />
          ))}
      </ul>
    </>
  );
}
