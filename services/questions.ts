import { db } from "@/db";
import { QuestionType } from "@prisma/client";
import { Question } from "@prisma/client";

export async function getAllQuestions({
  skip,
  pageSize,
  createdById,
}: {
  skip: Number;
  pageSize: Number;
  createdById: string;
}) {
  return await db.question.findMany({
    where: {
      isDeleted: false,
      createdById,
    },
    include: {
      objective_options: true,
      subjective_description: true,
      createdBy: true,
    },
    skip,
    take: pageSize,
  });
}

export enum QuestionSubmitE {
  ADD = "add",
  EDIT = "edit",
}

export async function createQuestion(reqData: Question) {
  // const {
  //   question_text,
  //   type,
  //   options,
  //   correctAnswer,
  //   description,
  //   timer,
  //   createdById,
  // } = reqData;
  console.log(reqData)
  return await db.question.create({
    data: {
      question_text,
      type,
      timer: parseInt(timer, 10),
      objective_options:
        type === QuestionType.OBJECTIVE
          ? {
              createMany: {
                data: options.map((optionText: string, index: Number) => ({
                  text: optionText,
                  isCorrect: index === correctAnswer,
                })),
              },
            }
          : undefined,
      subjective_description:
        type === QuestionType.SUBJECTIVE
          ? {
              create: {
                problem: question_text,
                description,
              },
            }
          : undefined,
      createdById,
    },
  });
}
