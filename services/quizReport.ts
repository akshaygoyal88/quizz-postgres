import { db } from "@/db";

export async function getReportsBySubmittedBy(submittedBy: string) {
    const reportRes = await db.userQuizReport.findMany({ where: { submittedBy } });
    const quizzes = [];
    for (const report of reportRes) {
      const quiz = await db.quiz.findMany({ where: { id: report.quizId } });
      quizzes.push(quiz[0]);
    }
    return {reportRes, quizzes};
  }

  export async function getReportByQuizIdAndSubmittedBy({quizId, submittedBy}:{quizId: string, submittedBy: string}){
    return db.userQuizReport.findFirst({where: {quizId, submittedBy}})
  }

  export async function getReportsByQuizId({skip, pageSize, quizId}: {skip:number, pageSize:number, quizId:string}) {
    const quizResByUser =  db.userQuizReport.findMany({
      where: {
        quizId
      },
      include: {
        user: true,
      }, 
      skip,
      take: pageSize
    });
    return quizResByUser
  }
  