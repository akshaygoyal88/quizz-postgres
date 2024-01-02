import { db } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(req: any, res: any) {
    try {
        // const tokenHeader = req.headers.authorization;

        // // Check if the token header exists and is not null or empty
        // if (!tokenHeader || tokenHeader === 'Bearer null') {
        //   return res.status(401).json({ error: 'Unauthorized' });
        // }

        // const isAdmin = tokenHeader.startsWith('Bearer ');

        // if (!isAdmin) {
        //   return res.status(403).json({ error: "Access denied. Only admins can create users." });
        // }

        const { question, options, type, correctAnswer } = await req.json();
        console.log(question, options, type, correctAnswer);
        const text = question

        // Assuming db object is properly initialized and connected
        const res = await db.question.create({
            data: {
                text,
                type,
                objectiveAnswers: {
                    createMany: {
                        data: options.map((text: any, index: any) => ({
                            text,
                            isCorrect: index === correctAnswer,
                        })),
                    },
                },
            },
        });
console.log(res)
        await db.$disconnect();


        return new NextResponse({ res })
    } catch (error) {
        console.error('Error saving question:', error);
        
    }
}
