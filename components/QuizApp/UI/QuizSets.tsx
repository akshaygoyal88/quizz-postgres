"use client";

import React from "react";
import QuizSetCard from "./QuizSetCard";
import { QuestionSet } from "@prisma/client";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";

export default function QuizSets() {
  const questionSets: QuestionSet[] = [];

  const { data, error, isLoading } = useFetch({
    url: `${pathName.questionSetApi.path}`,
  });

  const getQuestionCount = (questionSet: QuestionSet): number => {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data &&
        data.map((questionSet: QuestionSet) => (
          <QuizSetCard
            key={questionSet.id}
            questionSet={questionSet}
            // questionCount={getQuestionCount(questionSet)}
          />
        ))}
    </div>
  );
}
