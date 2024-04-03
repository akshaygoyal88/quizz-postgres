import { db } from "@/db";
import {
  QuestionType,
  QuizStatusTypeE,
  ReportStatusE,
  UserQuizAnswerStatus,
  UserQuizAnswers,
  UserQuizStatusE,
  UserQuizReport,
  Question,
} from "@prisma/client";
import { getReportByQuizIdAndSubmittedBy } from "./quizReport";
import { getQuestionByIds } from "./questions";
import { QuesType } from "@/types/types";

export async function userQuizQuestionInitilization(reqData: {
  quizId: string;
  questionId: string;
  submittedBy: string;
}) {
  if (!reqData.submittedBy) {
    return { error: "Submitted by is missing" };
  }

  await db.userQuizAnswers.updateMany({
    where: {
      quizId: reqData.quizId,
      submittedBy: reqData.submittedBy,
    },
    data: { isCurrent: false },
  });

  const alreadyExists = await getUserQuizQuestion({
    quizId: reqData.quizId,
    submittedBy: reqData.submittedBy,
    questionId: reqData.questionId,
  });

  if (alreadyExists) {
    return alreadyExists;
  } else {
    const createResForQues = await db.userQuizAnswers.create({
      data: {
        ...reqData,
        isCurrent: true,
      },
    });
    const question = await getQuestionByIds([createResForQues.questionId]);
    return { ...createResForQues, question: question[0] };
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
  const userQuizQuestion = await db.userQuizAnswers.findFirst({
    where: {
      quizId,
      submittedBy,
      questionId,
    },
  });
  if (!userQuizQuestion) {
    return null;
  }
  const question = (await getQuestionByIds([questionId])) as Question[];
  return { ...userQuizQuestion, question: question[0] };
}

interface saveResProps extends UserQuizAnswers {
  ans_optionsIds: string[];
}

export async function saveResponseForQues(reqData: saveResProps) {
  const {
    id,
    status,
    timeTaken: timeTakenStr,
    timeOver: timeOverStr,
    ans_optionsIds,
    ans_subjective,
  } = reqData;
  const timeTaken = parseInt(`${timeTakenStr}`);
  const timeOver = timeOverStr === "1" ? true : false;

  return await db.userQuizAnswers.update({
    where: { id },
    data: {
      status,
      timeTaken,
      timeOver,
      ans_optionsId: ans_optionsIds?.join(','),
      ans_subjective,
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
  return await getUserQuiz({ quizId, submittedBy: userId });
}

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

export async function finalTestSubmission({
  quizId,
  submittedBy,
}: {
  quizId: string;
  submittedBy: string;
}) {
  const userQuizRes = await db.userQuizAnswers.findMany({
    where: { quizId, submittedBy },
  });
  const questionIds = userQuizRes.map(
    (userQuiz: UserQuizAnswers) => userQuiz.questionId
  );
  const questions = await getQuestionByIds(questionIds);
  const networkRes = [];
  let reportStatus: ReportStatusE = ReportStatusE.UNDERREVIEW;
  for (const res of userQuizRes) {
    const que = questions.find((q: QuesType) => q.id === res?.questionId);
    if (que.type === QuestionType.SUBJECTIVE) {
      reportStatus = ReportStatusE.UNDERREVIEW;
    }
    const correctOpt = que?.objective_options.find((o) => o.isCorrect === true);
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
    correctAnswers +=
      ans.status === UserQuizAnswerStatus.ATTEMPTED && ans.isCorrect ? 1 : 0;
    wrongAnswers +=
      ans.status === UserQuizAnswerStatus.ATTEMPTED && !ans.isCorrect ? 1 : 0;
    notAttempted += ans.status === UserQuizAnswerStatus.NOT_ATTEMPTED ? 1 : 0;
    skipped += ans.status === UserQuizAnswerStatus.SKIPPED ? 1 : 0;
  });
  const quizReportRes: UserQuizReport = await db.userQuizReport.update({
    where: { id: userReport?.id },
    data: {
      status: UserQuizStatusE.SUBMITTED,
      // correctAnswers,
      // wrongAnswers,
      // notAttempted,
      obtMarks: correctAnswers * 2,
      // negMarks: 0,
      // timeTaken,
      totalMarks: correctAnswers * 2 - 0,
      endedAt: new Date(),
      reportStatus,
    },
  });

  return quizReportRes;
}
export async function getUserQuiz({
  quizId,
  submittedBy,
}: {
  quizId: string;
  submittedBy: string | null;
}) {
  if (!submittedBy) {
    return { error: "Please login" };
  }
  const userQuizReport = await db.userQuizAnswers.findMany({
    where: { quizId, submittedBy },
  });
  const allQuizquestionIds = userQuizReport.map(
    (userQuizReport: { questionId: string }) => userQuizReport.questionId
  );

  const selectedQuestios = (await getQuestionByIds(
    allQuizquestionIds
  )) as Question[];
  return userQuizReport.map((report: { questionId: string }) => {
    const question = selectedQuestios.find(
      (question) => report.questionId === question.id
    );
    return { ...report, question };
  });
}
