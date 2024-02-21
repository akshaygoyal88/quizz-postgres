"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
const quizReportData = [
  { question: "Question 1", answer: "Answer 1", correct: true },
  { question: "Question 2", answer: "Answer 2", correct: false },
  { question: "Question 3", answer: "Answer 3", correct: true },
];
export default function QuizQuesSummary() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const submittedBy = searchParams.get("submittedBy");
  return (
    // <div className="m-4 flex items-center gap-4">
    <div className="grid gap-4 grid-cols-1 mx-6">
      <h1>Summary user response for quiz</h1>
      {quizReportData.map((item, index) => (
        <div key={index} className="rounded-lg shadow-lg bg-white">
          <div className="p-6 border-b border-gray-200">
            <div className="text-gray-900">
              <span
                className={
                  item.correct
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {item.question}
              </span>
              <br />
              <span>{item.answer}</span>
            </div>
            <div className="text-gray-600 font-semibold">
              {item.correct ? "Correct" : "Incorrect"}
            </div>
          </div>
        </div>
      ))}
    </div>
    // </div>
  );
}
