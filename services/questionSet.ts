import { db } from "@/db";
import { Quiz, QuizCreationStatusE } from "@prisma/client";

export async function getQuizzesWithPaginationByCreatedBy({
  skip,
  pageSize,
  createdById,
}: {
  skip: number;
  pageSize: number;
  createdById: string;
}) {
  const totalRows = await db.quiz.count({
    where: {
      status: {
        not: QuizCreationStatusE.DELETE
      },
      createdById
    },
  });
  const totalPages = Math.ceil(totalRows / pageSize);
  const quizzes = await db.quiz.findMany({
    where: {
      status: {
        not: QuizCreationStatusE.DELETE
      },
      createdById,
    },
    include: {
      createdBy: true,
    },
    skip,
    take: pageSize,
  });
  return {quizzes, totalRows, totalPages}
}
export async function getQuizzesByCreatedBy(createdById?: string) {
  return await db.quiz.findMany({
    where: {
      createdById,
      status: {
        not: QuizCreationStatusE.DELETE
      }
    },
    include: {
      createdBy: true,
    },
  });
}

export async function getFirstQuesIdOfQuiz(quizId: string) {
  const res = await db.quizQuestions.findFirst({
    where: {
      quizId
    }
  })
  
  return res?.questionId;
}

export enum QuestionSetSubmitE {
  CREATE="create",
  EDIT="edit",
} 

export async function createQuestionSet({
  name,
  description,
  status,
  price,
  createdById,
}: {
  name: string;
  description?: string;
  createdById: string;
  status?: string;
  price?: number;
}) {
  if (!createdById) {
    return { error: "In valid user please log in." };
  }
  if (!name) {
    return { error: "Please enter name" };
  }

  if(price && price < 0){
    return { error: "Price should not be less than 0.0" };
  }
  
  return await db.quiz.create({
    data: {
      name,
      description,
      createdById,
      status,
      price: parseFloat(price)
    },
  });
}

export async function editQuestionSet({
  id,
  reqData,
}: {
  id:string;
  reqData: Quiz
}) {
  const isAvailable = await db.quiz.findUnique({
    where: { id },
  });
  if(!id || !isAvailable){
    return { error: "Question/set not available" };
  }
  const {name,description,status,price} = reqData;
  if(price && price < 0){
    return { error: "Price should not be less than 0.0" };
  }
  return await db.quiz.update({
    where: {
      id,
    },
    data: { name,
      description,
      status,
      price: price ? parseFloat(price) : undefined },
  });
}



