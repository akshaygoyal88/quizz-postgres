import { db } from "@/db";

export async function submitAnswers(answerRecords: []) {
    const answers = []
    for(let answerRecord of answerRecords) {
        const answer = await db.userQuizAnswers.create({
            data: answerRecord
        });

        answers.push(answer);
    }
    return answers;
}
