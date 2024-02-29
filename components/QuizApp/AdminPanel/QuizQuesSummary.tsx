"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HTMLReactParser from "html-react-parser";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";
import {
  ObjectiveOptions,
  QuestionType,
  ReportStatusE,
  UserQuizAnswers,
} from "@prisma/client";
import { Button } from "../../Button";
import { FetchMethodE, fetchData } from "@/utils/fetch";

export default function QuizQuesSummary({ reportId }: { reportId: string }) {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const submittedBy = searchParams.get("submittedBy");
  const reportStatus = searchParams.get("reportStatus");
  const [marks, setMarks] = useState<{ [key: string]: number }>({});
  const [missingMark, setMissingMark] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSucessMessage] = useState<string | null>(null);

  // const {
  //   data: oridinalQueAndAns,
  //   error: oridinalQueAndAnsError,
  //   isLoading,
  // } = useFetch({
  //   url: `${pathName.testSetApis.path}/${quizId}`,
  // });

  const { data: candidateResponse, error: candidateResponseError } = useFetch({
    url: `${pathName.userQuizResponseApiRoute.path}/${quizId}?submittedBy=${submittedBy}`,
  });

  useEffect(() => {
    if (candidateResponse?.length > 0) {
      for (const res of candidateResponse) {
        const id: string = res.id;
        const mark =
          res.marks === null
            ? res.question.type === QuestionType.OBJECTIVE &&
              (res.isCorrect ? 1 : 0)
            : res.marks;
        setMarks((prevMarks) => ({
          ...prevMarks,
          [id]: mark,
        }));
      }
    }
  }, [candidateResponse]);

  const handleMarksChange = (id: string, mark: number) => {
    if (missingMark.includes(id)) {
      const filterArr = missingMark.filter((m) => m !== id);
      setMissingMark(filterArr);
    }
    setMarks((prevMarks) => ({
      ...prevMarks,
      [id]: mark,
    }));
  };

  const handleSave = async () => {
    setErrorMessage(null);
    // for (const [id, mark] of Object.entries(marks)) {
    //   if (!missingMark.includes(id) && mark === false) {
    //     setErrorMessage("Please check missing field");
    //     setMissingMark((prev) => [...prev, id]);
    //   }
    // }
    // if (missingMark.length > 0) {
    //   return;
    // }
    const {
      data: markSaveRes,
      error: markSaveError,
      isLoading: markSaveLoading,
    } = await fetchData({
      url: `${pathName.marksApiRoute.path}`,
      method: FetchMethodE.POST,
      body: { marks, reportId },
    });
    if (markSaveRes?.error?.length > 0) {
      setErrorMessage("Please check missing field");
      for (const error of markSaveRes.error) {
        const id = Object.keys(error)[0];
        setMissingMark((prev) => [...prev, id]);
      }
    } else if (markSaveRes.result.length > 0) {
      setSucessMessage("Successfully saved marks.");
      setTimeout(() => {}, 10000);
    }
  };

  return (
    <div className="sm:px-6">
      <div className="flex items-start justify-between my-4">
        <h1 className="font-bold text-gray-700 text-2xl">
          Detailed Quiz Report of candidate
        </h1>
        <Button onClick={handleSave}>Save and Publish Report</Button>
      </div>
      {successMessage && (
        <p className="text-white bg-green-700 p-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <span className="">
        Report Status:{" "}
        <text
          className={`${
            reportStatus === ReportStatusE.GENERATED
              ? "text-green-500"
              : "text-yellow-500"
          } `}
        >
          {reportStatus}
        </text>
      </span>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                Question
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Given Answer
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Answer Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Marks
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Time Taken
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {candidateResponse?.map((queRes: UserQuizAnswers) => (
              <TableRow
                key={queRes.id}
                queRes={queRes}
                marks={marks}
                onMarksChange={handleMarksChange}
                missingMark={missingMark}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableRow({
  queRes,
  marks,
  onMarksChange,
  missingMark,
}: {
  queRes: UserQuizAnswers;
  marks: { id: string; marks: number }[];
  onMarksChange: (id: string, mark: number) => void;
  missingMark: string[];
}) {
  const findGivenAnsText = (id: string, opts: ObjectiveOptions[]) => {
    const givAns = opts.find((ans: ObjectiveOptions) => ans.id === id);
    return givAns?.text;
  };

  const handleMarksInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    queRes.question.type === QuestionType.SUBJECTIVE &&
      onMarksChange(queRes.id, parseFloat(event.target.value));
  };

  return (
    <tr key={queRes.id}>
      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {HTMLReactParser(queRes.question.editorContent)}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        {(queRes.question.type === QuestionType.SUBJECTIVE &&
          queRes.ans_subjective) ||
          (queRes.ans_optionsId &&
            HTMLReactParser(
              findGivenAnsText(
                queRes.ans_optionsId,
                queRes.question.objective_options
              )
            ))}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        {(queRes.question.type === QuestionType.SUBJECTIVE &&
          "Subjective Type") ||
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
          ))}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        <input
          type="number"
          className={`border-2 border-gray-400 rounded w-full pl-1 py-1 text-black ${
            missingMark.includes(queRes.id) ? "border-red-600 border-3" : ""
          }`}
          value={marks[queRes.id]}
          step="0.01"
          min="0"
          max="1"
          onChange={(e) => {
            handleMarksInputChange(e);
          }}
        />
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        {queRes.timeTaken &&
          (queRes.timeTaken / 60 < 1
            ? queRes.timeTaken + " sec"
            : queRes.timeTaken / 60 + " min")}
      </td>
    </tr>
  );
}
