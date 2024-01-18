"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import LeftSectionQues from "./LeftSectionQues";
import RightSectionQuesList from "./RightSectionQuesList";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";
import { QuizContext } from "@/context/QuizProvider";

enum questionActionE {
  NOT_ATTEMPTED = "not_attempted",
  ATTEMPTED = "attempted",
  REVIEW = "review",
  SKIPPED = "skipped",
}

export default function TestLayout({ quizId }: { quizId: string }) {
  const ses = useSession();
  const quizCtx = useContext(QuizContext);

  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [questionStates, setQuestionStates] = useState<object[]>([]);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  const {
    data: questionsRes,
    error: questionsError,
    isLoading: questionsIsLoading,
  } = useFetch({
    url: `${pathName.testSetApis.path}/${quizId}`,
  });

  useEffect(() => {
    if (questionsRes && !questionsRes.error && !questionsError) {
      const quesArr: [] = questionsRes.questions.map(
        (ques: { id: any; question: any }) => ques.question
      );
      quizCtx.handleQuestionSet(quesArr);

      const questionStates = quesArr.map((ques) => ({
        id: ques.id,
        status: questionActionE.NOT_ATTEMPTED,
      }));

      setQuestionStates(questionStates);
      const firstQuestionId = questionStates[0].id;
      setCurrentQuestionId(firstQuestionId);
    }
  }, [questionsRes]);
  useEffect(() => {
    if (currentQuestionId) {
      for (let i = 0; i < questionStates.length; i++) {
        if (questionStates[i].id === currentQuestionId) {
          i < questionStates.length - 1 && setNextId(questionStates[i + 1].id);
          i > 0 && setPrevId(questionStates[i - 1].id);
        }
      }
    }
  }, [currentQuestionId]);

  const handleNextQuestion = () => {
    nextId && setCurrentQuestionId(nextId);
  };
  const handlePreviousQuestion = () => {
    prevId && setCurrentQuestionId(prevId);
  };

  const handleAnswerQuestion = (ans: string) => {
    if (ans) {
    }
    handleNextQuestion();
    // }
  };
  const handleMarkReviewQuestion = () => {
    // setQuestionStates((prevStates) => {
    //   const updatedStates = [...prevStates];
    //   updatedStates[currentQuestionIndex] = questionActionE.REVIEW;
    //   return updatedStates;
    // });
    // handleNextQuestion();
  };

  const handleQuesNoClick = (id: string) => {
    setCurrentQuestionId(id);
  };

  const handleSubmit = () => {};

  return (
    <>
      <div className="mt-4">
        <main className="pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {quizCtx.questionSet.length > 0 && (
                <LeftSectionQues
                  questions={quizCtx.questionSet}
                  currentQuestionId={currentQuestionId}
                  handleMarkReviewQuestion={handleMarkReviewQuestion}
                  handleAnswerQuestion={handleAnswerQuestion}
                  handlePreviousQuestion={handlePreviousQuestion}
                />
              )}
              {quizCtx.questionSet.length > 0 && (
                <RightSectionQuesList
                  questions={quizCtx.questionSet}
                  ses={ses}
                  questionStates={questionStates}
                  handleQuesNoClick={handleQuesNoClick}
                  currentQuestionId={currentQuestionId}
                />
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
