import { db } from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "0", 10);

  try {
    if (page>0 && pageSize>0) {
      const totalRows = await db.questionSet.count(
        {where: {
          isDeleted: false,
        }}
      );

      const totalPages = Math.ceil(totalRows / pageSize);

      const skip = (page - 1) * pageSize;

      const questionSets = await db.questionSet.findMany({
        include: {
          questions: true,
        },
        skip,
        take: pageSize,
      });

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
      const allQuestionSets = await db.questionSet.findMany();
      return NextResponse.json(allQuestionSets);
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(req: any, res: any) {
  try {
    const reqData = await req.json();
    console.log(reqData);

    const createSet = await db.questionSet.create({
      data: {
        ...reqData,
        createdBy: {
          connect: { id: 'clra6qmbq002p9yp85h428scm' },
        },
      },
    });
    return NextResponse.json(createSet);
  } catch (error) {
    return NextResponse.json(error);
  }
}
