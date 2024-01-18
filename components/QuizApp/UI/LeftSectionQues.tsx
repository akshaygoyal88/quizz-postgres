"use client";

import Textarea from "@/components/Shared/Textarea";
import { QuizContext } from "@/context/QuizProvider";
import { ObjectiveOptions, QuestionType } from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";

export default function LeftSectionQues({
  questions,
  currentQuestionId,
  handleMarkReviewQuestion,
  handleAnswerQuestion,
  handlePreviousQuestion,
}) {
  const quizCtx = useContext(QuizContext);
  const currQues = quizCtx.questionSet.find((q) => q.id === currentQuestionId);
  const [timer, setTimer] = useState(currQues.timer);
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer: number) =>
        prevTimer > 0 ? prevTimer - 1 : prevTimer
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleAnswerQuestion(answer);
    }
  }, [timer]);
  useEffect(() => {
    setAnswer(null);
    setTimer(currQues.timer);
  }, [currentQuestionId]);

  const handleNextClick = () => {
    handleAnswerQuestion(answer);
    setAnswer(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
      <section aria-labelledby="question-title">
        <div className="border-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="" id="question-title">
                Question {quizCtx.questionSet.indexOf(currQues) + 1}
              </h2>
              {timer > 0 && (
                <div className="">
                  <h3 className="text-lg font-semibold">Time</h3>

                  <p>
                    {Math.floor(timer / 60)}:{timer % 60}
                  </p>
                </div>
              )}
            </div>
            <p>{currQues.question_text}</p>
            {currQues.type === QuestionType.OBJECTIVE ? (
              <div className="mt-4">
                {currQues.objective_options.map(
                  (option: ObjectiveOptions, index: Number) => (
                    <label key={index} className="block p-4">
                      <input
                        type="radio"
                        name="options"
                        value={option.text}
                        onChange={(e) => setAnswer(e.target.value)}
                        checked={answer === option.text}
                      />
                      <span className="ml-2">{option.text}</span>
                    </label>
                  )
                )}
              </div>
            ) : (
              <div className="mt-4">
                <Textarea
                  id="answer"
                  label="Type Answer"
                  className="border-2 w-3/4"
                  value={answer === null ? "" : answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="m-2 flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              className="mr-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <button
              onClick={handleMarkReviewQuestion}
              className="mr-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
            >
              Mark For Review
            </button>

            <button
              onClick={handleNextClick}
              className="mr-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
