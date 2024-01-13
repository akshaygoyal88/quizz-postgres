import { db } from "@/db";
import { QuestionType } from "@prisma/client";
import {Question} from "@prisma/client";


export async function getAllQuestions({skip, pageSize}:{skip:Number, pageSize:Number}){
    return await db.question.findMany({
        where: {
          isDeleted: false
        },
        include: {
          objective_options: true,
          subjective_description: true,
        },
        skip,
        take: pageSize,
    });
}

export async function createQuestion(
    {question_text,
    type,
    questionSet,
    options,
    correctAnswer,
    description,
    timer,
    createdById} : Question
  ){
    return await db.question.create({
        data: {
          question_text,
          type,
          timer: parseInt(timer, 10),          
          objective_options: type === QuestionType.OBJECTIVE ? {
            createMany: {
              data: options.map((optionText: any, index: any) => ({
                text: optionText,
                isCorrect: index === correctAnswer,
              })),
            },
          } : undefined,
          subjective_description: type === QuestionType.SUBJECTIVE ? {
            create: {
              problem: question_text,
              description,
            },
          } : undefined,
          createdBy: {
            connect: { id: createdById },
          },
        },
      });
}