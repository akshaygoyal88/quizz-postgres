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
  ObjectiveOptions,
  AnswerTypeE,
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
    await db.userQuizAnswers.update({
      where: {
        id: alreadyExists.id,
      },
      data: { isCurrent: false },
    });
    return alreadyExists;
  } else {
    const ques: QuesType[] | { error: string } = await getQuestionByIds([
      reqData.questionId,
    ]);
    let questions_marks = 0;
    if (Array.isArray(ques)) {
      if (ques[0].answer_type === AnswerTypeE.MULTIPLECHOICE) {
        questions_marks = ques[0].objective_options.reduce(
          (acc: number, curr: ObjectiveOptions) => {
            if (curr && curr.option_marks && curr.option_marks > 0) {
              return acc + curr.option_marks;
            } else {
              return acc;
            }
          },
          0
        );
      } else {
        questions_marks = ques[0].objective_options.reduce(
          (maxMarks: number, curr: ObjectiveOptions) => {
            return Math.max(maxMarks, curr.option_marks || 0);
          },
          0
        );
      }
    }

    const createResForQues = await db.userQuizAnswers.create({
      data: {
        ...reqData,
        isCurrent: true,
        questions_marks,
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
    questionId
  } = reqData;
  const timeTaken = parseInt(`${timeTakenStr}`);
  const timeOver = timeOverStr === "1" ? true : false;

  const ques = await getQuestionByIds([questionId]);
  const optionIdWithMarks: { [id: string]: number } = {}; 

  if(Array.isArray(ques)) {
    ques[0].objective_options.forEach(option => {
        optionIdWithMarks[option.id] = option.option_marks;
  });
  }

  let marks = 0;
  
  for(let i = 0; i<ans_optionsIds.length; i++){
    marks += optionIdWithMarks[ans_optionsIds[i]];
  }

  const result =  await db.userQuizAnswers.update({
    where: { id },
    data: {
      status,
      timeTaken,
      timeOver,
      ans_optionsId: ans_optionsIds?.join(","),
      ans_subjective,
      marks
    },
  });

  return result ? {message: "Successfully saved response"} : {message: "Error"};
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
    where: { quizId, candidateId: submittedBy },
  });
  if (isAvailableRes) {
    return {
      isAvailable: true,
      isAvailableRes,
      message: "Quiz already initialized",
    };
  }
  const initializeQuizRes = await db.userQuizReport.create({
    data: { candidateId:submittedBy, quizId, candidateStatus: UserQuizStatusE.INPROGRESS },
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
  for (const res of userQuizRes) {
    const que = questions.find((q: QuesType) => q.id === res?.questionId);
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
    where: { candidateId: submittedBy, quizId },
  });
  const userAnswers = await db.userQuizAnswers.findMany({
    where: { quizId, submittedBy },
  });

  const obtMarks: number = userAnswers.reduce((acc: number, curr: UserQuizAnswers) => acc + curr.marks!, 0);
  const totalMarks = userAnswers.reduce((acc: number, curr: UserQuizAnswers) => acc + curr.questions_marks!, 0);

  const quizReportRes: UserQuizReport = await db.userQuizReport.update({
    where: { id: userReport?.id },
    data: {
      candidateStatus: UserQuizStatusE.SUBMITTED,
      // correctAnswers,
      // wrongAnswers,
      // notAttempted,
      obtMarks,
      // negMarks: 0,
      // timeTaken,
      totalMarks,
      candidateQuizEndtime: new Date(),
      quizOwnerStatus: ReportStatusE.UNDERREVIEW
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
