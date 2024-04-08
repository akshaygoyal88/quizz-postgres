import { db } from "@/db";
import { QuizCreationStatusE, ReportStatusE } from "@prisma/client";
import { getUserQuiz } from "./answerSubmission";
import { sendEmailToUser } from "./sendEmail";
import { formattedDate } from "@/utils/formattedDate";
import { getQuizByQuizId } from "./quiz";

export async function getQuizsByAttemptedByUser(candidateId: string) {
  const reportRes = await db.userQuizReport.findMany({
    where: { candidateId },
  });
  const quizzes = [];
  const quizList = await db.quiz.findMany({
    where: { status: {
      not: QuizCreationStatusE.DELETE
    }}
  });
  for (const report of reportRes) {
    const quiz = quizList.find(q => q.id === report.quizId)
    quizzes.push({id: quiz?.id, name: quiz?.name});
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

  const quizData = await getQuizByQuizId(quizId);

  //  updateReportRes && await sendEmailToUser({
  //     userId: submittedBy,
  //     subject: "Test Report",
  //     templateId: process.env.TEST_REPORT_TEMP_ID || "",
  //     dynamicTemplateData: {
  //       quiz_name: quizData?.name,
  //       status: "Report " + updateReportRes.quizOwnerStatus,
  //       attempt_date: formattedDate(updateReportRes.candidateQuizStartTime),
  //       obtMarks: updateReportRes.obtMarks?.toString() || "",
  //       totalMarks: updateReportRes.totalMarks?.toString() || "",
  //       link_of_report: `${process.env.NEXT_PUBLIC_BASE_URL}/${submittedBy}/reports/${quizId}`
  //     },
  //   });
  return error.length > 0 ? { error } : { result, updateReportRes };
}

export async function getQuizReportStatusOfCandidate({candidateId, quizId}: {candidateId: string, quizId:string}) {
  const res = await db.userQuizReport.findFirst({
    where: { candidateId, quizId },
  });

  return res?.candidateStatus;

} 
