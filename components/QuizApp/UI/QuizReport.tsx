"use client";

import React from "react";
import Lable from "@/components/Shared/Lable";
import { Question, ReportStatusE, UserQuizReport } from "@prisma/client";
import { useRouter } from "next/navigation";
import { QuizQuestionReportTable } from "../AdminPanel/QuizQuesSummary";
import { Button } from "@/components/Button";
import Heading from "@/components/Shared/Heading";
import { Container, FormContainer } from "@/components/Container";
import { CandidateResponseTypes } from "@/types/types";

interface QuizQuestion {
  question: string;
  answer: string;
  correct: boolean;
}

const QuizReport = ({
  userId,
  attempetdQuiz,
  quizId,
  dataOfSelectedQuiz,
  candidateResponse,
}: {
  userId: string;
  attempetdQuiz:
    | {
        id: string | undefined;
        name: string | undefined;
        isDeleted: boolean | undefined;
      }[]
    | [];
  quizId?: string;
  dataOfSelectedQuiz: UserQuizReport | null;
  candidateResponse: CandidateResponseTypes[];
}) => {
  const router = useRouter();

  const handleSelectQuiz = (id: string) => {
    router.push(`/${userId}/reports/${id}`);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      <Heading headingText="Quiz Report" tag="h1" />
      <SelectQuiz
        defaultValue={quizId}
        quizzes={attempetdQuiz}
        handleSelectQuiz={handleSelectQuiz}
      />
      {!dataOfSelectedQuiz ? (
        <div className="flex flex-col items-center">
          Please select quiz to see report.
        </div>
      ) : (
        <Container>
          {dataOfSelectedQuiz?.reportStatus === ReportStatusE.UNDERREVIEW ? (
            <ReportUnderReview />
          ) : (
            <>
              <ReportElement
                reportElementList={[
                  { Attempts: "1" },
                  {
                    "Start at": formatDate(dataOfSelectedQuiz?.startedAt!),
                  },
                  {
                    "End at": formatDate(dataOfSelectedQuiz?.endedAt!),
                  },
                  { Marks: `${dataOfSelectedQuiz?.totalMarks}` },
                ]}
              />
              <QuizQuestionReportTable candidateResponse={candidateResponse} />
              <Button>Go to Home Page</Button>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default QuizReport;

function SelectQuiz({
  defaultValue,
  quizzes,
  handleSelectQuiz,
}: {
  defaultValue?: string;
  quizzes:
    | {
        id: string | undefined;
        name: string | undefined;
        isDeleted: boolean | undefined;
      }[]
    | [];
  handleSelectQuiz: (id: string) => void;
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
          quizzes.map(
            (quiz: {
              id: string | undefined;
              name: string | undefined;
              isDeleted: boolean | undefined;
            }) =>
              !quiz.isDeleted ? (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.name}
                </option>
              ) : null
          )}
      </select>
    </div>
  );
}

const ReportElement = ({
  reportElementList,
}: {
  reportElementList: { [key: string]: string }[];
}) => {
  return (
    <div className="w-full bg-white my-2 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
      {reportElementList.map((reportElement, index) => (
        <div
          key={index}
          className="px-4 bg-gray-100 mb-4 rounded-lg flex justify-between items-center"
        >
          {Object.entries(reportElement).map(([key, val]) => (
            <React.Fragment key={key}>
              <span className="py-2 bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
                {key}
              </span>
              <span className="text-lg font-semibold">{val}</span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

const ReportUnderReview = () => {
  return (
    <div className="px-4 py-4 bg-gray-100 mb-4 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="bg-gradient-to-r from-yellow-400 font-semibold to-red-500 text-transparent bg-clip-text">
          Report status
        </span>
        <span className="text-lg font-semibold">Under Review</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <span className="font-bold">Note:</span>{" "}
        <span>Will announce report soon</span>
      </div>
    </div>
  );
};
