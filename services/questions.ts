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
  const {
    setId,
    question_text,
    type,
    options,
    correctAnswer,
    description,
    timer,
    createdById,
  } = reqData;

  if (!setId) {
    return { error: "Please provide question set." };
  }
  const addQuestion =  await db.question.create({
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
  const createdBy = createdById
  const questionId = addQuestion.id;

  const quizAdd = await db.quiz.create({
    data:{
      setId,
      questionId,
      createdBy
    }
  })
  
  return {addQuestion, quizAdd};
}

export async function editQuestions({
  id,
  reqData,
}: {
  id:string;
  reqData: Question
}){

  const {
    question_text,
    type,
    questionSet,
    options,
    correctAnswer,
    description,
    timer,
    isDeleted,
  } = reqData;
  const isAvailable = await db.question.findUnique({
    where: { id },
  });

  if (isAvailable) {

    type === QuestionType.OBJECTIVE ? await db.objectiveOptions.deleteMany({
      where: { questionId: id },
    }) : await db.subjectiveDescription.deleteMany({
      where: { questionId: id },
    });
    const editQues =  await db.question.update({
      where: {id},
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
      },
    });
    return editQues;
  } else {
    return {error: "Invalid question"}
  }
  
  
}