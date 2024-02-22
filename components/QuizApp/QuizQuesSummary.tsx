"use client";

import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import {
  ObjectiveOptions,
  QuestionType,
  UserQuizAnswers,
} from "@prisma/client";
import HTMLReactParser from "html-react-parser";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function QuizQuesSummary() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const submittedBy = searchParams.get("submittedBy");

  const { data: oridinalQueAndAns, error: oridinalQueAndAnsError } = useFetch({
    url: `${pathName.testSetApis.path}/${quizId}`,
  });
  console.log(oridinalQueAndAns);

  const { data: candidateResponse, error: candidateResponseError } = useFetch({
    url: `${pathName.userQuizResponseApiRoute.path}/${quizId}?submittedBy=${submittedBy}`,
  });
  console.log(candidateResponse);

  return (
    <div className="sm:px-6">
      <h1>Detailed Quiz Report of candidate</h1>
      <div className="flow-root">
        <div className="overflow-x-auto sm:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Question
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Given Answer
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Answer Status
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Marks
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Time Taken
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {candidateResponse?.map((queRes: UserQuizAnswers) => (
                  <TableRow key={queRes.id} queRes={queRes} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ queRes }: { queRes: UserQuizAnswers }) {
  const findGivenAnsText = (id: string, opts: ObjectiveOptions[]) => {
    const givAns = opts.find((ans: ObjectiveOptions) => ans.id === id);
    return givAns?.text;
  };

  return (
    <tr key={queRes.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {HTMLReactParser(queRes.question.editorContent)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
          ) : (
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
          ))}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input
          type="number"
          className="border-2 border-gray-400 rounded w-2/5 pl-1 py-1 text-black"
          defaultValue={
            queRes.question.type === QuestionType.OBJECTIVE &&
            (queRes.isCorrect ? 1 : 0)
          }
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {queRes.timeTaken / 60 < 1
          ? queRes.timeTaken + " sec"
          : queRes.timeTaken / 60 + " min"}
      </td>
    </tr>
  );
}
