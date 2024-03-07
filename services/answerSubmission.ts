import { db } from "@/db";
import {
  QuestionType,
  QuizStatusTypeE,
  ReportStatusE,
  UserQuizAnswerStatus,
  UserQuizAnswers,
  UserQuizStatusE,
  userQuizReport,
} from "@prisma/client";
import { getReportByQuizIdAndSubmittedBy } from "./quizReport";

export async function userQuizQuestionInitilization(reqData: {quizId: string, questionId: string, submittedBy: string}) {
  if(!reqData.submittedBy) {
    return {error: "Submitted by is missing"}
  }
  
  await db.userQuizAnswers.updateMany({
    where: {
      quizId: reqData.quizId,
      submittedBy: reqData.submittedBy,
    },
    data: { isCurrent: false },
  });

  const alreadyExists = await getUserQuizQuestion({
    quizId : reqData.quizId,
    submittedBy:reqData.submittedBy, 
    questionId:reqData.questionId
  });

  if(alreadyExists){
    return alreadyExists;
  } else{
    return await db.userQuizAnswers.create({
      data: {
        ...reqData,
        isCurrent: true,
      },
      include:{
        question: {
          include: {
            objective_options: true
          }
        }
      
      }
    });
  } 
}

export async function getUserQuizQuestion({
  quizId,
  submittedBy,
  questionId,
}: {
  quizId: string;
  submittedBy: string;
  questionId: string;
}) {
  return await db.userQuizAnswers.findFirst({
    where: {
      quizId,
      submittedBy,
      questionId,
    },
    include:{
      question: {
        include: {
          objective_options: true
        }
      }
    
    }
  });
}

export async function saveResponseForQues(reqData: UserQuizAnswers) {
  const {id, status, timeTaken: timeTakenStr, timeOver: timeOverStr, ans_optionsId, ans_subjective} = reqData;
  const timeTaken = parseInt(timeTakenStr);
  const timeOver = timeOverStr === "1" ? true : false

  return await db.userQuizAnswers.update({
    where: { id },
    data: {
      status,
      timeTaken,
      timeOver,
      ans_optionsId,
      ans_subjective
    },
  });
}

export async function getUserQuizAllQuestionAnswers({
  quizId,
  userId,
}: {
  quizId: string;
  userId: string;
}) {
  return await db.userQuizAnswers.findMany({
    where: {
      quizId,
      submittedBy: userId,
    },
    include: {
      question: {
        include: {
          objective_options: true,
        },
      },
    }
  });
}

// export async function saveResponseForQues({setId,
//     submittedBy,
//     questionId,status,
//     isAnswered,
//     ans_optionsId,
//     ans_subjective,
//     timeTaken,
//     timeOver,}: UserQuizAnswers) {
//         const answerRes = await db.userQuizAnswers.update({
//             where: {
//                 setId,
//                 submittedBy,
//                 questionId
//             },
//             data: {
//                 status,
//                 isAnswered,
//                 ans_optionsId,
//                 ans_subjective,
//                 timeTaken,
//                 timeOver,
//             }
//         });

//         return answerRes;

// }

export async function quizInitializationForReport(
  quizId: string,
  submittedBy: string
) {
  const isAvailableRes = await db.userQuizReport.findFirst({
    where: { quizId, submittedBy },
  });
  if (isAvailableRes) {
    return {
      isAvailable: true,
      isAvailableRes,
      message: "Quiz already initialized",
    };
  }
  const initializeQuizRes = await db.userQuizReport.create({
    data: { submittedBy, quizId, status: UserQuizStatusE.INPROGRESS },
  });
  return {
    initializeQuizRes,
    isInitialized: true,
    message: "Successfully initialized",
  };
}

export async function finalTestSubmission({ questions, quizId, submittedBy }) {
  const userQuizRes = await db.userQuizAnswers.findMany({
    where: { quizId, submittedBy },
  });
  const networkRes = [];
  let reportStatus: ReportStatusE = ReportStatusE.UNDERREVIEW;
  for (const res of userQuizRes) {
    const que = questions.find((q) => q.questionId === res?.questionId);
    if (que.question.type === QuestionType.SUBJECTIVE) {
      reportStatus = ReportStatusE.UNDERREVIEW;
    }
    const correctOpt = que?.question?.objective_options.find(
      (o) => o.isCorrect === true
    );
    const id = res.id;
    if (que) {
      const updateIsCorrect = await db.userQuizAnswers.update({
        where: { id },
        data: { isCorrect: correctOpt?.id === res?.ans_optionsId },
      });
      networkRes.push({ id, updateIsCorrect });
    } else {
      networkRes.push({ id, error: "Question not found" });
    }
  }

  const userReport = await db.userQuizReport.findFirst({
    where: { submittedBy, quizId },
  });
  const userAnswers = await db.userQuizAnswers.findMany({
    where: { quizId, submittedBy },
  });

  let correctAnswers = 0;
  let wrongAnswers = 0;
  let notAttempted = 0;
  let skipped = 0;
  const timeTaken = (Date.now() - userReport.startedAt) / 1000;

  userAnswers.forEach((ans) => {
    correctAnswers += ans.isAnswered && ans.isCorrect ? 1 : 0;
    wrongAnswers += ans.isAnswered && !ans.isCorrect ? 1 : 0;
    notAttempted += ans.status === UserQuizAnswerStatus.NOT_ATTEMPTED ? 1 : 0;
    skipped += ans.status === UserQuizAnswerStatus.SKIPPED ? 1 : 0;
  });

  const quizReportRes: userQuizReport = await db.userQuizReport.update({
    where: { id: userReport?.id },
    data: {
      status: QuizStatusTypeE.SUBMITTED,
      correctAnswers,
      wrongAnswers,
      notAttempted,
      obtMarks: correctAnswers * 2,
      negMarks: 0,
      timeTaken,
      totalMarks: correctAnswers * 2 - 0,
      endedAt: new Date(),
      reportStatus,
    },
  });

  return quizReportRes;
}
