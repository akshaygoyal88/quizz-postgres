"use client";

import Lable from "@/components/Shared/Lable";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { Quiz, ReportStatusE } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface QuizQuestion {
  question: string;
  answer: string;
  correct: boolean;
}
// const Breadcrumb: React.FC<{ trail: string }> = ({ trail }) => {
//   const trailItems = trail.split(" > ");

//   return (
//     <nav className="m-4" aria-label="Breadcrumb">
//       <ol className="flex items-center">
//         {trailItems.map((item, index) => (
//           <li key={index}>
//             <Link
//               href={`/${item}`}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               {item}
//             </Link>
//             {index < trailItems.length - 1 && (
//               <span className="mx-1 text-gray-600">{">"}</span>
//             )}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// };

const QuizReport = ({ userId }: { userId: string }) => {
  const quizReportData: QuizQuestion[] = [
    { question: "Question 1", answer: "Answer 1", correct: true },
    { question: "Question 2", answer: "Answer 2", correct: false },
    { question: "Question 3", answer: "Answer 3", correct: true },
  ];
  const [attempetdQuiz, setAttemptedQuiz] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [reportsList, setReportsList] = useState([]);
  const [dataOfSelectedQuiz, setDataOfSelectedQuiz] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error, isLoading } = await fetchData({
        url: `/api/quiz/quizReport/${userId}`,
        method: FetchMethodE.GET,
      });
      console.log(data);
      if (data.quizzes) {
        setAttemptedQuiz(data.quizzes);
      }
      if (data.reportRes) {
        setReportsList(data.reportRes);
      }
    };
    userId && fetchReport();
  }, [userId]);

  const handleSelectQuiz = (id) => {
    setSelectedQuiz(id);
    const reportForSelectedQuiz = reportsList.find((rep) => rep.quizId === id);

    reportForSelectedQuiz && setDataOfSelectedQuiz(reportForSelectedQuiz);
  };
  console.log(dataOfSelectedQuiz);

  return (
    <div>
      {/* <Breadcrumb trail="Quizzes > Reports" /> */}
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
      <SelectQuiz
        defaultValue={""}
        quizzes={attempetdQuiz}
        handleSelectQuiz={handleSelectQuiz}
      />

      {!selectedQuiz ? (
        <div className="flex flex-col items-center">
          Please select quiz to see report.
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 sm:px-6">
          <div className="w-full">
            {dataOfSelectedQuiz.reportStatus === ReportStatusE.UNDERREVIEW ? (
              <div className="px-4 py-4 bg-gray-100 mb-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="bg-gradient-to-r from-yellow-400 font-semibold to-red-500 text-transparent bg-clip-text">
                    Report status
                  </span>
                  <span className="text-lg font-semibold">Under Review</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <p className="font-bold">Note:</p>{" "}
                  <text>Will announce report soon</text>
                </div>
              </div>
            ) : (
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
                    Start at
                  </span>
                  <span className="text-lg font-semibold">
                    {new Date(
                      dataOfSelectedQuiz?.startedAt
                    ).toLocaleDateString()}{" "}
                    {new Date(
                      dataOfSelectedQuiz?.startedAt
                    ).toLocaleTimeString()}
                  </span>
                </div>

                <div className="p-4 bg-gray-100 mb-4 rounded-lg h-32 flex justify-between items-center">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                    End at
                  </span>
                  <span className="text-lg font-semibold">
                    {new Date(dataOfSelectedQuiz?.endedAt).toLocaleDateString()}{" "}
                    {new Date(dataOfSelectedQuiz?.endedAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="p-4 bg-gray-100 mb-4 rounded-lg h-32 flex justify-between items-center">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                    Time Taken
                  </span>
                  <span className="text-lg font-semibold">
                    {Math.floor(dataOfSelectedQuiz?.timeTaken / 3600)} hrs{" "}
                    {Math.floor((dataOfSelectedQuiz?.timeTaken % 3600) / 60)}{" "}
                    mins
                  </span>
                </div>

                <div className="px-4 bg-gray-100 mb-4 rounded-lg flex justify-between items-center">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                    Questions Not Attempted
                  </span>
                  <span className="text-lg font-semibold">
                    {dataOfSelectedQuiz?.notAttempted}
                  </span>
                </div>
                <div className="px-4 bg-gray-100 mb-4 rounded-lg flex justify-between items-center">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                    Correct answers
                  </span>
                  <span className="text-lg font-semibold">
                    {dataOfSelectedQuiz?.correctAnswers}
                  </span>
                </div>
                <div className="px-4 bg-gray-100 mb-4 rounded-lg flex justify-between items-center">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                    Wrong answers
                  </span>
                  <span className="text-lg font-semibold">
                    {dataOfSelectedQuiz?.wrongAnswers}
                  </span>
                </div>

                <div className="p-4 bg-gray-100 mb-4 rounded-lg h-32 flex justify-between items-center">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                    Marks
                  </span>
                  <span className="text-lg font-semibold">
                    {dataOfSelectedQuiz?.totalMarks}
                  </span>
                </div>
              </div>
            )}

            {dataOfSelectedQuiz?.reportStatus === ReportStatusE.GENERATED && (
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
            )}
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
      )}
    </div>
  );
};

export default QuizReport;

function SelectQuiz({
  defaultValue,
  quizzes,
  handleSelectQuiz,
}: {
  defaultValue: string;
  quizzes: Quiz[];
  handleSelectQuiz: (id) => void;
}) {
  return (
    <div className="m-4 flex items-center gap-4">
      <Lable labelText="Please select quiz for report:" />
      <select
        className=" border rounded-md p-2"
        defaultValue={defaultValue}
        name="setId"
        onChange={(e) => handleSelectQuiz(e.target.value)}
      >
        <option value="">Select Quiz</option>
        {quizzes &&
          quizzes.map((queSet: QuestionSet) =>
            !queSet.isDeleted ? (
              <option key={queSet.id} value={queSet.id}>
                {queSet.name}
              </option>
            ) : null
          )}
      </select>
    </div>
  );
}
