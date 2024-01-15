import { db } from "@/db";
import { createQuestion, getAllQuestions } from "@/Services/questions";
import { QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "0", 10);
  const createdById = url.searchParams.get("createdById");

  try {
    if (page>0 && pageSize>0) {
      const totalRows = await db.question.count({
        where: {
          isDeleted: false,
          createdById          
        },
      });

      const totalPages = Math.ceil(totalRows / pageSize);

      const skip = (page - 1) * pageSize;
      const questions = await getAllQuestions({skip, pageSize, createdById})
      return new Response(
        JSON.stringify({ questions, totalPages, totalRows }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
    const getAllQuestions = await db.question.findMany();
    return NextResponse.json(getAllQuestions);
    }
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
      timer,
      createdById
    } = await req.json();

    if (!questionSet) {
      return NextResponse.json({ error: "Please provide question set." });
    }

    const setsAvailable = await db.questionSet.findMany();

    const setDetail = setsAvailable.find((set) => set.name === questionSet);

    if (!setDetail) {
      return NextResponse.json({
        error: "Please provide a valid question set.",
      });
    }

    const addQuestion = await createQuestion(
      {question_text,
      type,
      questionSet,
      options,
      correctAnswer,
      description,
      timer,
      createdById}
    )
    return NextResponse.json(addQuestion);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

