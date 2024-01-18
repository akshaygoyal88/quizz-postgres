import { db } from "@/db";
import { UserQuizAnswers } from "@prisma/client";

export async function questionInitialization(reqData) {
        const initiallyQues = await db.userQuizAnswers.create({
            data: {
                ...reqData
            }
        });
    return initiallyQues;
}

export async function getQuesStatus({setId, submittedBy, questionId}:{setId:string, submittedBy:string, questionId:string}) {
    return await db.userQuizAnswers.findFirst({
        where:{
          setId,
          submittedBy,
          questionId
        }
      })
}

export async function saveResponseForQues({id, reqData} : {id: string, reqData: UserQuizAnswers}){
    return await db.userQuizAnswers.update({
        where: { id },
        data: {
            ...reqData
        }
    })
}

export async function getUserQuiz({setId, submittedBy}:{setId:string, submittedBy:string, questionId:string}) {
    return await db.userQuizAnswers.findFirst({
        where:{
          setId,
          submittedBy,
        }
      })
}


// export async function saveResponseForQues({setId,
//     submittedBy,
//     questionId,status,
//     isAnswered,
//     ans_optionsId,
//     ans_subjective,
//     timeTaken,
//     timeOver,}: UserQuizAnswers) {
//         const answerRes = await db.userQuizAnswers.update({
//             where: {
//                 setId,
//                 submittedBy,
//                 questionId
//             },
//             data: {
//                 status,
//                 isAnswered,
//                 ans_optionsId,
//                 ans_subjective,
//                 timeTaken,
//                 timeOver,
//             }
//         });

//         return answerRes;
        
// }

