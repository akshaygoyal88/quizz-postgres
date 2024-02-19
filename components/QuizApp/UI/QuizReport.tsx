import Link from "next/link";
import React from "react";

interface QuizQuestion {
  question: string;
  answer: string;
  correct: boolean;
}

interface QuizReportProps {
  attempts: number;
  startDate: Date;
  endDate: Date;
  timeTaken: string;
  marks: number;
}

const Breadcrumb: React.FC<{ trail: string }> = ({ trail }) => {
  const trailItems = trail.split(" > ");

  return (
    <nav className="m-4" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {trailItems.map((item, index) => (
          <li key={index}>
            <Link
              href={`/${item}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {item}
            </Link>
            {index < trailItems.length - 1 && (
              <span className="mx-1 text-gray-600">{">"}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const QuizReport: React.FC<QuizReportProps> = (
  {
    //   attempts,
    //   startDate,
    //   endDate,
    //   timeTaken,
    //   marks,
  }
) => {
  const dummyData: QuizReportProps = {
    attempts: 3,
    startDate: new Date(2022, 0, 1),
    endDate: new Date(2022, 0, 2),
    timeTaken: "1 hour 30 minutes",
    marks: 8,
  };
  const quizReportData: QuizQuestion[] = [
    { question: "Question 1", answer: "Answer 1", correct: true },
    { question: "Question 2", answer: "Answer 2", correct: false },
    { question: "Question 3", answer: "Answer 3", correct: true },
  ];

  return (
    <>
      <Breadcrumb trail="Quizzes > Reports" />
      <nav className="m-4 bg-gray-200">
        <ul className="flex items-center">
          <li className="hover:bg-gray-400 px-4 py-2 hover:cursor-pointer">
            Overview
          </li>
          <li className="hover:bg-gray-400 px-4 py-2 hover:cursor-pointe">
            Attempts
          </li>
        </ul>
      </nav>
      <h2 className="mx-4 mt-2 text-3xl font-extrabold text-gray-900">
        Quiz Report
      </h2>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 sm:px-6">
        <div className="w-full">
          <div className="bg-white my-2 p-4 rounded-lg border border-gray-200 grid grid-cols-3 gap-4">
            <div className="px-4 bg-gray-100 mb-4 rounded-lg flex justify-between items-center">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                Attempts
              </span>
              <span className="text-lg font-semibold">
                {dummyData.attempts}
              </span>
            </div>

            <div className="p-4 bg-gray-100 mb-4 rounded-lg h-32 flex justify-between items-center">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                Start Date
              </span>
              <span className="text-lg font-semibold">
                {dummyData.startDate.toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-gray-100 mb-4 rounded-lg h-32 flex justify-between items-center">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                End Date
              </span>
              <span className="text-lg font-semibold">
                {dummyData.endDate.toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-gray-100 mb-4 rounded-lg h-32 flex justify-between items-center">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                Time Taken
              </span>
              <span className="text-lg font-semibold">
                {dummyData.timeTaken}
              </span>
            </div>

            <div className="p-4 bg-gray-100 mb-4 rounded-lg h-32 flex justify-between items-center">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                Marks
              </span>
              <span className="text-lg font-semibold">{dummyData.marks}</span>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1">
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
          <div className="mt-4">
            <button
              // onClick={() => {
              //   // Navigate to another page
              //   console.log("Navigate to another page");
              // }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizReport;
