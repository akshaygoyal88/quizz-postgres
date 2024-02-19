"use client";

import Textarea from "@/components/Shared/Textarea";
import { QuizContext } from "@/context/QuizProvider";
import {
  ObjectiveOptions,
  Question,
  QuestionType,
  UserQuizAnswers,
} from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";

export default function LeftSectionQues({
  currentQuestionId,
  handleMarkReviewQuestion,
  handleAnswerQuestion,
  handlePreviousQuestion,
  currInitializedQue,
}: {
  currentQuestionId: string;
  handleMarkReviewQuestion: () => void;
  handleAnswerQuestion: ({
    answer,
    timeTaken,
    timeOver,
    type,
  }: {
    answer: string;
    timeTaken: number;
    type: QuestionType;
    timeOver: boolean;
  }) => void;
  handlePreviousQuestion: () => void;
  currInitializedQue: Question;
}) {
  const quizCtx = useContext(QuizContext);
  const filtredQues = quizCtx.questionSet.find(
    (q) => q.id === currentQuestionId
  );
  const isTimerAvailable = filtredQues?.timer !== 0;
  const [timer, setTimer] = useState(filtredQues?.timer);
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (currInitializedQue) {
      setAnswer(
        filtredQues?.type === QuestionType.OBJECTIVE
          ? currInitializedQue.ans_optionsId
          : currInitializedQue.ans_subjective
      );
    }
  }, [currInitializedQue]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerAvailable) {
        setTimer((prevTimer: number) =>
          prevTimer > 0 ? prevTimer - 1 : prevTimer
        );
      } else {
        setTimer((prevTimer: number) => prevTimer + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isTimerAvailable, timer]);

  useEffect(() => {
    if (isTimerAvailable && timer === 0) {
      handleSubmitNextClick();
    }
  }, [timer]);

  useEffect(() => {
    setAnswer(null);
    filtredQues && setTimer(filtredQues.timer);
  }, [currentQuestionId]);

  const handleSubmitNextClick = () => {
    const timeTaken = isTimerAvailable ? filtredQues?.timer - timer : timer;
    const timeOver = isTimerAvailable && timeTaken === filtredQues?.timer;
    filtredQues &&
      handleAnswerQuestion({
        answer,
        timeTaken,
        timeOver,
        type: filtredQues.type,
      });
    answer && setAnswer(null);
  };

  const handlePrevious = () => {
    handlePreviousQuestion();
  };

  const handleAnsOptInput = (str) => {
    setAnswer(str);
  };
  const optionsIndex = ["a", "b", "c", "d", "e", "f"];

  return (
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
      <section aria-labelledby="question-title">
        <div className="border-2 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="" id="question-title">
                Question {quizCtx.questionSet.indexOf(filtredQues) + 1}
              </h2>
              {isTimerAvailable && (
                <div className="">
                  <h3 className="text-lg font-semibold">Time</h3>

                  <p>
                    {Math.floor(timer / 60)}:{timer % 60}
                  </p>
                </div>
              )}
            </div>
            <p className="py-4">{filtredQues?.question_text}</p>
            {/* <div
              dangerouslySetInnerHTML={{ __html: filtredQues?.editorContent }}
            /> */}
            <div>{HTMLReactParser(filtredQues?.editorContent)}</div>

            {filtredQues?.type === QuestionType.OBJECTIVE ? (
              <div className="mt-4">
                {filtredQues.objective_options.map(
                  (option: ObjectiveOptions, index: Number) => (
                    <div key={index} className="p-4 flex items-center">
                      <input
                        type="radio"
                        name="options"
                        value={option.text}
                        onChange={() => handleAnsOptInput(option.id)}
                        checked={answer === option.id}
                      />
                      <text className="p-2">{`(${optionsIndex[index]})`}</text>
                      <span className="ml-2">
                        {HTMLReactParser(option.text)}
                      </span>
                    </div>
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
              onClick={handlePrevious}
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
              onClick={handleSubmitNextClick}
              className="mr-4 px-4 py-2 bg-blue-900 text-white rounded-md"
            >
              Submit and Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
