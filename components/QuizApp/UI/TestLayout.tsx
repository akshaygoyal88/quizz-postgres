"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LeftSectionQues from "./LeftSectionQues";
import RightSectionQuesList from "./RightSectionQuesList";

export default function TestLayout({ quizId }: { quizId: string }) {
  const questions = [
    {
      id: 1,
      content: "What is the capital of France?",
    },
    {
      id: 2,
      content: "Who wrote 'Romeo and Juliet'?",
    },
    {
      id: 3,
      content: "Who wrote 'Romeo and Juliet'?",
    },
  ];

  const ses = useSession();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState(
    Array(questions.length).fill("not_attempted")
  );
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
    );
  };
  const handlePreviousQuestion = () => {
    console.log("dcdscs");
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };
  const handleAnswerQuestion = () => {
    setQuestionStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[currentQuestionIndex] = "attempted";
      return updatedStates;
    });
    handleNextQuestion();
  };
  const handleMarkReviewQuestion = () => {
    setQuestionStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[currentQuestionIndex] = "review";
      return updatedStates;
    });
    handleNextQuestion();
  };

  const handleQuesNoClick = (idx) => {
    setCurrentQuestionIndex(idx);
  };

  const [timer, setTimer] = useState(5); // 5 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {};

  return (
    <>
      <div className="mt-4">
        <main className="pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              <LeftSectionQues
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                timer={timer}
                handleMarkReviewQuestion={handleMarkReviewQuestion}
                handleAnswerQuestion={handleAnswerQuestion}
                handlePreviousQuestion={handlePreviousQuestion}
              />
              <RightSectionQuesList
                questions={questions}
                ses={ses}
                questionStates={questionStates}
                handleQuesNoClick={handleQuesNoClick}
              />
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
