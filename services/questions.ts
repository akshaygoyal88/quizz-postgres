import { db } from "@/db";
import { QuestionType } from "@prisma/client";
import { Question } from "@prisma/client";

export async function getAllQuestions({
  skip,
  pageSize,
  createdById,
}: {
  skip: number;
  pageSize: number;
  createdById: string;
}) {
  const totalRows = await db.question.count({
    where: {
      isDeleted: false,
      createdById          
    },
  });

  const totalPages = Math.ceil(totalRows / pageSize);

  const questions =  await db.question.findMany({
    where: {
      isDeleted: false,
      createdById,
    },
    include: {
      objective_options: true,
      createdBy: true,
    },
    skip,
    take: pageSize,
  });
  return { questions, totalPages, totalRows }
}

export enum QuestionSubmitE {
  ADD = "add",
  EDIT = "edit",
}

export async function createQuestion(reqData: Question) {

  const {
    quizId,
    type,
    options,
    correctAnswer,
    solution,
    timer,
    createdById,
    editorContent,
    answer_type
  } = reqData;
  

  if (!quizId) {
    return { error: "Please provide question set." };
  }
  const addQuestion = await db.question.create({
    data: {
      editorContent,
      type,
      timer: parseInt(timer, 10),
      objective_options:
        type === QuestionType.OBJECTIVE
          ? {
              createMany: {
                data: options.map((optionText: string, index: Number) => ({
                  text: optionText,
                  isCorrect: correctAnswer.includes(index),
                })),
              },
            }
          : undefined,
      solution,
      answer_type,
      createdById,
    },
  });
  const createdBy = createdById;
  const questionId = addQuestion.id;

  const quizAdd = await db.quizQuestions.create({
    data: {
      quizId,
      questionId,
      createdBy,
    },
  });
  
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
    quizId,
    type,
    options,
    correctAnswer,
    solution,
    timer,
    editorContent,
    answer_type
  } = reqData;

  if(!quizId){
    return {error: "Please provide quiz."}
  }
  const isAvailable = await db.question.findUnique({
    where: { id },
  });

  if (isAvailable) {

    type === QuestionType.OBJECTIVE && await db.objectiveOptions.deleteMany({
      where: { questionId: id },
    }) 
    const editQues =  await db.question.update({
      where: {id},
      data: {
        editorContent,
        type,
        timer: parseInt(timer, 10),              
        objective_options:
          type === QuestionType.OBJECTIVE
            ? {
                createMany: {
                  data: options.map((optionText: string, index: Number) => ({
                    text: optionText,
                    isCorrect: correctAnswer.includes(index),
                  })),
                },
              }
            : undefined,
       solution,
       answer_type
      },
    });
    return editQues;
  } else {
    return {error: "Invalid question"}
  }
}

export async function getQuestionByQuestionId(id: string){
  if(!id){
    return {error: "Question ID not provided."}
  }
  return await db.question.findUnique({
    where: { id },
    include: {
      objective_options: true,
    },
  });
}