import { db } from "@/db";

export async function getReportsBySubmittedBy(submittedBy: string) {
    const reportRes = await db.userReportOfQuiz.findMany({ where: { submittedBy } });
    const quizzes = [];
    for (const report of reportRes) {
      const quiz = await db.quiz.findMany({ where: { id: report.quizId } });
      quizzes.push(quiz[0]);
    }
    return {reportRes, quizzes};
  }
  