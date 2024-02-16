import { db } from "@/db";
import { createQuestion, getAllQuestions } from "@/services/questions";
import { getQuesSetVailable } from "@/services/questionSet";
import { postQuestionInQuiz } from "@/services/quiz";
import { QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("getttiiing")

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
      editorContent,
      type,
      objective_options,
      solution,
      timer,
      createdById,
      Quiz
    } = await req.json();
    // console.log(await req.json())

    // if (!Quiz[0]?.setId) {
    //   return NextResponse.json({ error: "Please provide question set." });
    // }

    const correctAnswer: Number[] = []
    
    objective_options?.forEach((option: { isCorrect: any; }, i: Number) => {
      option.isCorrect == true && correctAnswer.push(i)});

    const options =  objective_options?.map((opt: { text: any; })=> opt.text);

    const setId = Quiz[0].setId;

    const addQuestion = await createQuestion(
    {editorContent,
      type,
      options,
      correctAnswer,
      solution,
      timer,
      createdById,
      setId
    })
  
    return NextResponse.json(addQuestion);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}

