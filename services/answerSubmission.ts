import { db } from "@/db";
import { UserQuizAnswers } from "@prisma/client";

export async function submitAnswers({answerRecords}: {answerRecords: UserQuizAnswers[]}) {
    const answers = []
    for(let answerRecord of answerRecords) {
        const answer = await db.userQuizAnswers.create({
            data: answerRecord
        });
        answers.push(answer);
    }
    return answers;
}
