import { db } from "@/db";
import { Quiz, Subscription } from "@prisma/client";
import { createNotification } from "./notification";
import { getUserById } from "./user";
import { getUserQuiz } from "./answerSubmission";

export async function getQuizQuestions({ quizId }: { quizId: string }) {
  return await db.quizQuestions.findMany({
    where: {
      quizId,
    },
    include: {
      question: {
        include: {
          objective_options: true,
        },
      },
    },
  });
}

export async function deleteQuiz({ setId }: { setId: string }) {
  const quizId = setId;
  return await db.quizQuestions.deleteMany({
    where: {
      quizId,
    },
  });
}

export async function postQuestionInQuiz({
  setId,
  questionId,
  createdBy,
}: {
  setId: string;
  questionId: string;
  createdBy: string;
}) {
  const quizId = setId;
  return await db.quizQuestions.create({
    data: {
      quizId,
      questionId,
      createdBy,
    },
  });
}

export async function getQuizDetailByQuizId(quizId: string) {
  if (!quizId) {
    return { error: "Quiz name missing." };
  }

  const quizRes = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      createdBy: true,
    },
  });
  return quizRes ? quizRes : { error: "Invalid quiz" };
}

export async function createSubscriptionOfQuiz(reqData: Subscription) {
  const { quizId, candidateId } = reqData;
  if (!quizId) {
    return { error: "QuizId is missing" };
  }
  if (!candidateId) {
    return { error: "CandidateId is missing" };
  }
  const isAlreadySubsCribed = await isSubscribedToQuiz(reqData);
  if (isAlreadySubsCribed) {
    return { error: "Candidate already subscribed this quiz." };
  }
  const res = await db.subscription.create({
    data: {
      quizId,
      candidateId,
    },
  });

  const quiz:any = await getQuizDetailByQuizId(quizId);

  const candidate: any = await getUserById(candidateId);

  if (res) {
    await createNotification({
      userId: candidateId,
      message: `Successfully subscribed to ${quiz.name} quiz.`,
    });
    await createNotification({
      userId: quiz.createdById,
      message: `${candidate.first_name || candidate.email} subscibed your ${
        quiz.name
      } quiz.`,
    });
  }

  return res;
}

export async function isSubscribedToQuiz({
  candidateId,
  quizId,
}: {
  candidateId: string;
  quizId: string;
}) {
  return await db.subscription.findFirst({ where: { candidateId, quizId } });
}

export async function getSubscribersByQuizId(quizId: string) {
  if (!quizId) return { error: "Quiz Id missing" };
  return await db.subscription.findMany({
    where: { quizId },
    include: { user: true },
  });
}

export async function updateSubscriptionOfUser({
  id,
  reqData,
}: {
  id: string;
  reqData: Subscription;
}) {
  if (!id) {
    return { error: "Subscription Id missing" };
  }
  return await db.subscription.update({
    where: { id },
    data: {
      ...reqData,
    },
  });
}

export async function getQuizQuestionByID({
  quizId,
  questionId,
}: {
  quizId: string;
  questionId: string;
}) {
  return await db.quizQuestions.findFirst({
    where: { quizId, questionId },
    include: {
      question: {
        include: {
          objective_options: true,
        },
      },
    },
  });
}

export async function getUserQuizQuestionsAnswers({
  quizId,
  userId,
}: {
  quizId: string;
  userId: string;
}) {
  const allQuestions = await getQuizQuestions({ quizId });
  const questions = allQuestions.map((q) => q.question);
  const allUserQuestionAnswer : any= await getUserQuiz({
    quizId,
    submittedBy: userId,
  });
  let final: any = [...questions];
  for (let i = 0; i < final.length; i++) {
    for (const u of allUserQuestionAnswer) {
      if (final[i]?.id === u.questionId) {
        final[i] = { ...final[i], status: u.status };
      }
    }
  }
  return final;
}

export async function getQuizByQuizId(id: string) {
  if (!id) {
    return { error: "Quiz id is missing." };
  }
  return await db.quiz.findUnique({
    where: { id },
  });
}

export async function updateQuiz(reqData: any) {
  const { id, ...data } = reqData;
  if (!reqData.id) {
    return { error: "Quiz id is missing" };
  }
  const res = await db.quiz.update({
    where: { id },
    data: {
      ...data,
    },
  });

  if (!res) {
    return { error: "Quiz id is not correct" };
  }

  console.log(res, "res delete id");

  return res;
}
