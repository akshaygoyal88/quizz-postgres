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
import Heading from "@/components/Shared/Heading";
import { Container } from "@/components/Container";
import { CandidateResponseTypes } from "@/types/types";
import { formattedDate } from "@/utils/formattedDate";
import { Table } from "@/components/Shared/Table";
import HTMLReactParser from "html-react-parser";
import { Button } from "@/components/Shared/Button";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

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
    const givenAns = id.split(",");
    let givAns = "";

    for (let i = 0; i < givenAns.length; i++) {
      const opt = opts.find((ans: ObjectiveOptions) => ans.id === givenAns[i]);
      givAns += opt?.text;
      i < givenAns.length - 1 ? (givAns += ", ") : (givAns += "");
    }
    return givAns;
  };

  const tableRows = candidateResponse.map((queRes) => [
    queRes.isCorrect ? (
      <FaCheckCircle className="w-6 h-6 text-green-600" />
    ) : queRes?.question?.type === QuestionType.SUBJECTIVE ? (
      "Sub"
    ) : (
      <MdCancel className="w-6 h-6 text-red-600" />
    ),
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
    <>{queRes.question?.type}</>,
    <>{queRes.marks}</>,
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
          {dataOfSelectedQuiz?.quizOwnerStatus === ReportStatusE.UNDERREVIEW ? (
            <ReportUnderReview />
          ) : (
            <>
              <ReportElement
                reportElementList={[
                  { Attempts: "1" },
                  {
                    "Start at": formattedDate(
                      dataOfSelectedQuiz?.candidateQuizStartTime!
                    ),
                  },
                  {
                    "End at": formattedDate(
                      dataOfSelectedQuiz?.candidateQuizEndtime!
                    ),
                  },
                  { Marks: `${dataOfSelectedQuiz?.obtMarks}` },
                ]}
              />
              <Table
                headers={[
                  "Status",
                  "Questions",
                  "Given Answer",
                  "Question Type",
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
