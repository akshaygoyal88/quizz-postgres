import { db } from "@/db";
import { Quiz } from "@prisma/client";

export async function getQuiz({setId}: {setId: string}){
    return await db.quiz.findMany({
      where: {
        setId,
      },
      include:{
        question: {
          include: {
            objective_options: true,
            subjective_description: true
          }
        }
      }
  })
  }

  export async function deleteQuiz({setId}: {setId: string}){
    return await db.quiz.deleteMany({
      where: {
        setId,
      }
    })
  }


  export async function postQuestionInQuiz({setId, questionId, createdBy}: Quiz){
    return await db.quiz.create({
      data:{
        setId,
        questionId,
        createdBy
      }
    })
  }