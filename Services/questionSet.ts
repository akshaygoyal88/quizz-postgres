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