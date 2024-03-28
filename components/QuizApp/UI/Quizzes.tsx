"use client";

import React, { useState } from "react";
import QuizSetCard from "./QuizSetCard";
import Link from "next/link";
import { QuizDetail, UserDataType } from "@/types/types";
import Heading from "@/components/Shared/Heading";

export default function QuizList({
  allQuizzes,
  userData,
}: {
  allQuizzes: QuizDetail[];
  userData: UserDataType | null;
}) {
  return (
    <>
      <Heading headingText="Quiz" tag="h2" />
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
