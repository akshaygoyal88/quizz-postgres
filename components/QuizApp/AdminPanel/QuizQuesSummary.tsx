"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HTMLReactParser from "html-react-parser";
import pathName from "@/constants";
import {
  AnswerTypeE,
  ObjectiveOptions,
  QuestionType,
  ReportStatusE,
} from "@prisma/client";
import { Button } from "../../Shared/Button";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { CandidateResponseTypes } from "@/types/types";
import { Table } from "@/components/Shared/Table";
import Heading from "@/components/Shared/Heading";
import Form from "@/components/Shared/Form";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { handleReportSendEmail } from "@/action/actionReportEmailSend";

export default function QuizQuesSummary({
  reportId,
  candidateResponse,
  saveMarks,
  reportStatus,
  candidateId,
}: {
  reportId: string;
  candidateResponse: CandidateResponseTypes[];
  saveMarks: { [key: string]: number | boolean };
  reportStatus?: string;
  candidateId: string;
}) {
  const [marks, setMarks] = useState<{ [key: string]: number | boolean }>({
    ...saveMarks,
  });
  const [missingMark, setMissingMark] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleMarksChange = (id: string, mark: number, maxMark?: number) => {
    if (errorMessage) {
      setErrorMessage(null);
    }
    if (maxMark && mark > maxMark) {
      setErrorMessage("Marks must be smaller and equal to maximum Marks");
    }
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
    } else if (markSaveRes?.result?.length > 0) {
      setSuccessMessage("Successfully saved marks.");
      setTimeout(() => {}, 10000);
    }
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

  const formActions = async (formData: FormData) => {
    formData.append("candidateId", candidateId as string);
    formData.append("quizId", candidateResponse[0].quizId as string);
    formData.append("subject", "Report Generated" as string);
    const res = await handleReportSendEmail(formData);
    if (res?.error) {
      setErrorMessage(res?.error);
    } else {
      setSuccessMessage(res?.message!);
    }
  };

  const tableRows = candidateResponse.map((queRes: CandidateResponseTypes) => [
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
    queRes?.question?.type,
    <div className="flex items-center gap-2">
      <input
        type="number"
        className={`border-2 border-gray-400 rounded w-16 pl-1 py-1 text-black ${
          missingMark?.includes(queRes.id) ? "border-red-600 border-3" : ""
        } ${
          queRes.question?.type === QuestionType.SUBJECTIVE
            ? "border-yellow-500"
            : ""
        } `}
        defaultValue={
          typeof marks[queRes?.id] === "number"
            ? marks[queRes?.id].toString()
            : 0
        }
        step="0.01"
        min="0"
        max={`${
          queRes.question?.type === QuestionType.SUBJECTIVE
            ? `${queRes?.question.objective_options[0]?.option_marks}`
            : ""
        }`}
        onChange={(e) => {
          queRes.question?.type === QuestionType.SUBJECTIVE &&
            handleMarksChange(
              queRes.id,
              parseFloat(e.target.value),
              queRes?.question.objective_options[0]?.option_marks!
            );
        }}
      />

      <span className="text-lg">
        /
        {`${
          queRes?.question?.type === QuestionType.SUBJECTIVE
            ? queRes?.question?.objective_options[0]?.option_marks
            : queRes?.question?.answer_type === AnswerTypeE.MULTIPLECHOICE
            ? queRes?.question?.objective_options?.reduce(
                (acc: number, curr: ObjectiveOptions) =>
                  curr.option_marks! >= 0 ? acc + curr.option_marks! : acc,
                0
              )
            : queRes?.question?.objective_options?.reduce(
                (max: number, curr: ObjectiveOptions) =>
                  curr.option_marks! == undefined && curr.option_marks! > max
                    ? curr.option_marks!
                    : max,
                -Infinity
              )
        }`}
      </span>
    </div>,
    queRes.timeTaken &&
      (Number(queRes.timeTaken) / 60 < 1
        ? queRes.timeTaken + " sec"
        : Number(queRes.timeTaken) / 60 + " min"),
  ]);

  return (
    <div className="sm:px-6">
      <div className="flex items-start justify-between my-4">
        <Heading headingText="Detailed Quiz Report of candidate" tag="h1" />
        <Button onClick={handleSave}>Save and Publish Report</Button>
      </div>
      <Form
        classes="p-4"
        action={formActions}
        error={errorMessage}
        success={successMessage}
      >
        <Button>Send Email for Report</Button>
      </Form>
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
      <Table
        headers={[
          "Status",
          "Question",
          "Given Answer",
          "Question type",
          "Marks",
          "Time Taken",
        ]}
        rows={tableRows}
      />
    </div>
  );
}
