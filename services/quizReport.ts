import { db } from "@/db";
import { ReportStatusE } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserQuiz } from "./answerSubmission";

export async function getQuizsByAttemptedByUser(candidateId: string) {
  const reportRes = await db.userQuizReport.findMany({
    where: { candidateId },
  });
  const quizzes = [];
  const quizList = await db.quiz.findMany({});
  for (const report of reportRes) {
    const quiz = quizList.find(q => q.id === report.quizId)
    quizzes.push({id: quiz?.id, name: quiz?.name, isDeleted: quiz?.isDeleted});
  }
  return { quizzes };
}

export async function getQuizReportOfUser({candidateId, quizId}:{candidateId: string, quizId: string}) {
  return await db.userQuizReport.findFirst({
    where: { candidateId, quizId },
  });
  
}

export async function getReportByQuizIdAndSubmittedBy({
  quizId,
  candidateId,
}: {
  quizId: string;
  candidateId: string;
}) {
  return db.userQuizReport.findFirst({ where: { quizId, candidateId } });
}

export async function getReportsByQuizId({
  skip,
  pageSize,
  quizId,
}: {
  skip: number;
  pageSize: number;
  quizId: string;
}) {

  const totalRows = await db.userQuizReport.count({
    where: {
      quizId          
    },
  });

  const totalPages = Math.ceil(totalRows / pageSize);

  const quizResByUser = await db.userQuizReport.findMany({
    where: {
      quizId,
    },
    include: {
      user: true,
    },
    skip,
    take: pageSize,
  });
  return {quizResByUser, totalPages, totalRows};
}

export async function markSubmitByAdmin({
  marks,
  reportId,
}: {
  marks: { [id: string]: number | boolean };
  reportId: string;
}) {
  const result = [];
  let updateReportRes;
  const error = [];
  let submittedBy = "";
  let quizId = ""

  for (const [id, mark] of Object.entries(marks)) {
    if (mark !== false) {
      const res = await db.userQuizAnswers.update({
        where: {
          id,
        },
        data: {
          marks: typeof mark === 'number'  ? mark : undefined,
        },
      });
      submittedBy = res.submittedBy
      quizId = res.quizId;
      result.push(res);
    } else {
      error.push({ [id]: "Missing marks for this question." });
    }
  }

  if (error.length === 0 && result.length === Object.entries(marks).length) {
    const finalMarksFromUserQuizResponse = await getUserQuiz({quizId,submittedBy})
    if(Array.isArray(finalMarksFromUserQuizResponse)){
      const obtMarks = finalMarksFromUserQuizResponse.reduce((acc,curr) => acc + curr.marks, 0)
      console.log(obtMarks, "dfsdfdsfdsfdsf")
      const updateReport = await db.userQuizReport.update({
        where: {
          id: reportId,
        },
        data: {
          quizOwnerStatus: ReportStatusE.GENERATED,
          obtMarks,
        },
      });
      updateReportRes = updateReport;
    }
  }
  return error.length > 0 ? { error } : { result, updateReportRes };
}

export async function getQuizReportStatusOfCandidate({candidateId, quizId}: {candidateId: string, quizId:string}) {
  const res = await db.userQuizReport.findFirst({
    where: { candidateId, quizId },
  });

  return res?.candidateStatus;

} 
