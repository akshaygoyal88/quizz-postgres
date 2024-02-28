import { db } from "@/db";
import { Quiz, Subscription } from "@prisma/client";

export async function getQuiz({ setId }: { setId: string }) {
  const quizId = setId;
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
  console.log({ setId, questionId, createdBy });
  const quizId = setId;
  return await db.quizQuestions.create({
    data: {
      quizId,
      questionId,
      createdBy,
    },
  });
}

export async function createSubscriptionOfQuiz(reqData: Subscription) {
  if(!reqData.quizId){
    return {error: "QuizId is missing"}
  }
  if(!reqData.candidateId){
    return {error: "CandidateId is missing"}
  }
  return await db.subscription.create({
    data: {
      ...reqData
    }
  })
}
