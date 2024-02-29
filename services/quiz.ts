import { db } from "@/db";
import { Quiz, Subscription } from "@prisma/client";

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
  return quizRes ? quizRes : { error: "Invalid quiz"};
}

export async function createSubscriptionOfQuiz(reqData: Subscription) {
  if (!reqData.quizId) {
    return { error: "QuizId is missing" };
  }
  if (!reqData.candidateId) {
    return { error: "CandidateId is missing" };
  }
  const isAlreadySubsCribed = await isSubscribedToQuiz(reqData);
  if (isAlreadySubsCribed) {
    return { error: "Candidate already subscribed this quiz." };
  }
  return await db.subscription.create({
    data: {
      ...reqData,
    },
  });
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
