import { db } from "@/db";
import { createQuestion, getAllQuestions } from "@/services/questions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "0", 10);
  const createdById = url.searchParams.get("createdById")!;

  try {
    if (page>0 && pageSize>0) {

      const skip = (page - 1) * pageSize;
      const res = await getAllQuestions({skip, pageSize, createdById})
      return new Response(
        JSON.stringify(res),
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

export async function POST(req: Request, res: any) {
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
    const correctAnswer: Number[] = []
    
    objective_options?.forEach((option: { isCorrect: boolean; }, i: number) => {
      option.isCorrect == true && correctAnswer.push(i)});

    const options =  objective_options?.map((opt: { text: string; })=> opt.text);
 

    const addQuestion = await createQuestion(
    {editorContent,
      type,
      options,
      correctAnswer,
      solution,
      timer,
      createdById,
      quizId: "duplicate"
    })
  console.log(addQuestion)
    return NextResponse.json(addQuestion);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}

