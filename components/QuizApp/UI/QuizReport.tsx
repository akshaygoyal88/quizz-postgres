"use client";

import React from "react";
import Lable from "@/components/Shared/Lable";
import {
  ObjectiveOptions,
  QuestionType,
  ReportStatusE,
  UserQuizReport,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import Heading from "@/components/Shared/Heading";
import { Container } from "@/components/Container";
import { CandidateResponseTypes } from "@/types/types";
import { formattedDate } from "@/utils/formattedDate";
import { Table } from "@/components/Shared/Table";
import HTMLReactParser from "html-react-parser";

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
    router.push(`/${userId}/reports/${id || undefined}`);
  };

  const findGivenAnsText = (id: string, opts: ObjectiveOptions[]) => {
    const givAns = opts.find((ans: ObjectiveOptions) => ans.id === id);
    return givAns?.text;
  };

  const tableRows = candidateResponse.map((queRes) => [
    HTMLReactParser(queRes?.question?.editorContent!),
    (queRes?.question?.type === QuestionType.SUBJECTIVE &&
      queRes.ans_subjective) ||
      (queRes.ans_optionsId &&
        HTMLReactParser(
          findGivenAnsText(
            queRes?.ans_optionsId,
            queRes?.question?.objective_options!
          ) || ""
        )),
    (queRes?.question?.type === QuestionType.SUBJECTIVE && "Subjective Type") ||
      (queRes.isCorrect ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-green-600"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
          />
        </svg>
      ) : queRes.ans_optionsId ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-red-600"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        "Skipped"
      )),
    <>-</>,
    <>
      {queRes.timeTaken &&
        (Number(queRes.timeTaken) / 60 < 1
          ? queRes.timeTaken + " sec"
          : Number(queRes.timeTaken) / 60 + " min")}
    </>,
  ]);

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
                    "Start at": formattedDate(dataOfSelectedQuiz?.startedAt!),
                  },
                  {
                    "End at": formattedDate(dataOfSelectedQuiz?.endedAt!),
                  },
                  { Marks: `${dataOfSelectedQuiz?.totalMarks}` },
                ]}
              />
              <Table
                headers={[
                  "Questions",
                  "Given Answer",
                  "Answer status",
                  "Marks",
                  "Time Taken",
                ]}
                rows={tableRows}
              />
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
