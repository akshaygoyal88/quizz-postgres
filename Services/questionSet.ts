import { db } from "@/db";

export async function getAllQuestionsSet({skip, pageSize}:{skip:number, pageSize:number})  {
    return await db.questionSet.findMany({
        where: {
          isDeleted: false,
        },
        skip,
        take: pageSize,
      });
}

export async function createQuestionSet({reqData, createdBy}:{reqData: object, createdBy:string})  {
    return await db.questionSet.create({
      data: {
        ...reqData,
        createdBy: {
          connect: { id: createdBy },
        },
      },
  })
}