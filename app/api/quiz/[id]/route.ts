import { getQuiz, deleteQuiz } from "@/services/quiz";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: string }) {
  const setId: string = params?.id;
  try {
    if (!setId) {
      return NextResponse.json({ error: "Invalid quiz set." });
    }

    const getQuizAndQues = await getQuiz({ setId });

    return NextResponse.json({ questions: [...getQuizAndQues] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error });  }
}

export async function DELETE({ params }: { params: string }) {
  const setId: string = params?.id;
  if (!setId) {
    return NextResponse.json({ error: "Invalid quiz set." });
  }
  const deleteQuizs = await deleteQuiz({ setId });

  return NextResponse.json(deleteQuizs);
}
