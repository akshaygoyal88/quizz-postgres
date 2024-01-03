import { db } from "@/app/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const getAllQuestions = await db.question.findMany();
    return NextResponse.json(getAllQuestions);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: any, res: any) {
  try {
    const {
      question_text,
      type,
      questionSet,
      options,
      correctAnswer,
      description,
    } = await req.json();
    // console.log(question_text, type, questionSet, options, correctAnswer);

    if (!questionSet) {
      return NextResponse.json({ error: "Please provide question set." });
    }

    const setsAvailable = await db.questionSet.findMany();

    const setDetail = setsAvailable.filter((set) => set.name == questionSet);

    console.log(setDetail)

    if (setDetail.length == 0) {
      return NextResponse.json({
        error: "Please provide a valid question set.",
      });
    }
    if (type === "OBJECTIVE") {
      const createQuestion = await db.question.create({
        data: {
          question_text,
          type,
          questionSets: {
            connect: { id: setDetail[0].id },
          },
          objective_options: {
            createMany: {
              data: options.map((optionText: any, index: any) => ({
                text: optionText,
                isCorrect: index === correctAnswer,
              })),
            },
          },
        },
      });
      return NextResponse.json(createQuestion);
    } else {
      const problem = question_text;
      const createQuestion = await db.question.create({
        data: {
          question_text,
          type,
          questionSets: {
            connect: { id: setDetail[0].id },
          },
          subjective_description: {
            create: {
              problem,
              description,
            },
          },
        },
      });
      return NextResponse.json(createQuestion);
    }
  } catch (error) {
    return NextResponse.json({ error });
  }
}
