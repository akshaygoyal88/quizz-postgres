import { db } from "@/db";
import { createQuestionSet, getAllQuestionsSet, getQuestionSets } from "@/services/questionSet";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "0", 10);
  const createdById: string | null = url.searchParams.get("createdById")
  

  try {
    if (page > 0 && pageSize > 0 && createdById) {
      const totalRows = await db.quiz.count({
        where: {
          isDeleted: false,
          createdById
        },
      });
      const totalPages = Math.ceil(totalRows / pageSize);
      const skip = (page - 1) * pageSize;
      const questionSets = await getAllQuestionsSet({skip, pageSize, createdById})

      return new Response(
        JSON.stringify({ questionSets, totalPages, totalRows }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      const allQuestionSets =  createdById ? await getQuestionSets(createdById) : await getQuestionSets()
      return NextResponse.json(allQuestionSets);
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(req: any, res: any) {
  try {
    const {createdById, name, description} = await req.json();
    if (!createdById) {
      return NextResponse.json({ error: "In valid user please log in." });
    }
    if (!name) {
      return NextResponse.json({ error: "Please fill fields." });
    }
    const createSet = await createQuestionSet({createdById, name, description});
    return NextResponse.json(createSet);
  } catch (error) {
    return NextResponse.json(error);
  }
}
