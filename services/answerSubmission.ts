import { db } from "@/db";
import {
  QuestionType,
  QuizStatusTypeE,
  ReportStatusTypeE,
  UserQuizAnswerStatus,
  UserQuizAnswers,
  UserReportOfQuiz,
} from "@prisma/client";

export async function questionInitialization(reqData) {
  const initiallyQues = await db.userQuizAnswers.create({
    data: {
      ...reqData,
    },
  });
  return initiallyQues;
}

export async function getQuesStatus({
  setId,
  submittedBy,
  questionId,
}: {
  setId: string;
  submittedBy: string;
  questionId: string;
}) {
  return await db.userQuizAnswers.findFirst({
    where: {
      setId,
      submittedBy,
      questionId,
    },
  });
}

export async function saveResponseForQues({
  id,
  reqData,
}: {
  id: string;
  reqData: UserQuizAnswers;
}) {
  console.log("markrevie", reqData);
  return await db.userQuizAnswers.update({
    where: { id },
    data: {
      ...reqData,
    },
  });
}

export async function getUserQuiz({
  setId,
  submittedBy,
}: {
  setId: string;
  submittedBy: string;
  questionId: string;
}) {
  return await db.userQuizAnswers.findFirst({
    where: {
      setId,
      submittedBy,
    },
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
  const isAvailableRes = await db.userReportOfQuiz.findFirst({
    where: { quizId, submittedBy },
  });
  if (isAvailableRes) {
    return {
      isAvailable: true,
      isAvailableRes,
      message: "Quiz already initialized",
    };
  }
  const initializeQuizRes = await db.userReportOfQuiz.create({
    data: { submittedBy, quizId, status: QuizStatusTypeE.INCOMPLETED },
  });
  return {
    initializeQuizRes,
    isInitialized: true,
    message: "Successfully initialized",
  };
}

export async function finalTestSubmission({ questions, quizId, submittedBy }) {
  const userQuizRes = await db.userQuizAnswers.findMany({
    where: { setId: quizId, submittedBy },
  });
  const networkRes = [];
  let reportStatus: ReportStatusTypeE = ReportStatusTypeE.GENERATED
  for (const res of userQuizRes) {
    const que = questions.find((q) => q.questionId === res?.questionId);
    if(que.question.type === QuestionType.SUBJECTIVE){
      reportStatus = ReportStatusTypeE.UNDERREVIEW
    }
    const correctOpt = que?.question?.objective_options.find(
      (o) => o.isCorrect === true
    );

    // console.log({ correctOptId})
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

  const userReport = await db.userReportOfQuiz.findFirst({
    where: { submittedBy, quizId },
  });
  const userAnswers = await db.userQuizAnswers.findMany({
    where: { setId: quizId, submittedBy },
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

  const quizReportRes: UserReportOfQuiz = await db.userReportOfQuiz.update({
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
      reportStatus
    },
  });

  return quizReportRes;
}
