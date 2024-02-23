import { db } from "@/db";
import { ReportStatusE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function getReportsBySubmittedBy(submittedBy: string) {
  const reportRes = await db.userQuizReport.findMany({
    where: { submittedBy },
  });
  const quizzes = [];
  for (const report of reportRes) {
    const quiz = await db.quiz.findMany({ where: { id: report.quizId } });
    quizzes.push(quiz[0]);
  }
  return { reportRes, quizzes };
}

export async function getReportByQuizIdAndSubmittedBy({
  quizId,
  submittedBy,
}: {
  quizId: string;
  submittedBy: string;
}) {
  return db.userQuizReport.findFirst({ where: { quizId, submittedBy } });
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
  const quizResByUser = db.userQuizReport.findMany({
    where: {
      quizId,
    },
    include: {
      user: true,
    },
    skip,
    take: pageSize,
  });
  return quizResByUser;
}

export async function markSubmitByAdmin({
  marks,
  reportId,
}: {
  marks: { id: string; mark: number };
  reportId: string;
}) {
  const result = [];
  let updateReportRes;
  const error = [];

  for (const [id, mark] of Object.entries(marks)) {
    if (mark !== false) {
      const res = await db.userQuizAnswers.update({
        where: {
          id,
        },
        data: {
          marks: mark,
        },
      });
      result.push(res);
    } else {
      error.push({ [id]: "Missing marks for this question." });
    }
  }

  if (error.length === 0 && result.length === Object.entries(marks).length) {

    const obtMarks = result.reduce((acc, curr) => acc+ curr.marks , 0);
    const updateReport = await db.userQuizReport.update({
      where: {
        id: reportId,
      },
      data: {
        reportStatus: ReportStatusE.GENERATED,
        obtMarks,
        totalMarks: obtMarks,
      },
    });
    updateReportRes = updateReport;
  }
  return error.length > 0 ? { error } : { result, updateReportRes };
}
