import { db } from "@/db";

export async function getAllQuestionsSet({skip, pageSize, createdById}:{skip:number, pageSize:number, createdById:string})  {
    return await db.questionSet.findMany({
        where: {
          isDeleted: false,
          createdById
        },
        include: {
          createdBy: true,
        },
        skip,
        take: pageSize,
      });
}
export async function getQuestionSets (createdById: string) {
  return await db.questionSet.findMany(
    {
      where: {
        createdById
      }
    })
}

export async function createQuestionSet({name, description, createdById}:{name: string, description?:string, createdById:string})  {
    return await db.questionSet.create({
      data: {
        name,
        description,
        createdById
      },
  })
}