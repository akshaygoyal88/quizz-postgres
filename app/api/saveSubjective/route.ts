// pages/api/saveSubjectiveQuestion.js

import { db } from "@/app/db";
import { NextResponse } from "next/server";


export async function POST(req, res) {



//   if (req.method === 'POST') {
//     const tokenHeader = req.headers.authorization;

//     // Check if the token header exists and is not null or empty
//     if (!tokenHeader || tokenHeader === 'Bearer null') {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const isAdmin = tokenHeader.startsWith('Bearer ');

//     if (!isAdmin) {
//       return res.status(403).json({ error: "Access denied. Only admins can create users." });
//     }

    try {
      const { question, description, type } = await req.json();
      console.log(question, description)
      const text = question
      const problem = description

      const savedQuestion = await db.question.create({
        data: {
          text,
          type,
          subjectiveAnswers: {
            create: {
              problem,
              description,
            },
          },
        },
      });

    //   res.status(201).json(savedQuestion);
    return  new NextResponse({ savedQuestion })
    } catch (error) {
      console.error('Error:', error);
      return  new NextResponse({ error })

    //   res.status(500).json({ error: 'Internal Server Error' });
    } 
}
