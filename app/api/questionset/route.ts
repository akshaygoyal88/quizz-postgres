import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "0", 10);

  try {
    if (page > 0 && pageSize > 0) {
      const totalRows = await db.questionSet.count({
        where: {
          isDeleted: false,
        },
      });

      const totalPages = Math.ceil(totalRows / pageSize);

      const skip = (page - 1) * pageSize;

      const questionSets = await db.questionSet.findMany({
        where: {
          isDeleted: false,
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
    const createdBy = reqData.createdById;
    if (createdBy) {
      delete reqData.createdById;
    } else {
      return NextResponse.json({ error: "In valid user please log in." });
    }

    if (!reqData.name) {
      return NextResponse.json({ error: "Please fill fields." });
    }

    const createSet = await db.questionSet.create({
      data: {
        ...reqData,
        createdBy: {
          connect: { id: createdBy },
        },
      },
    });
    return NextResponse.json(createSet);
  } catch (error) {
    return NextResponse.json(error);
  }
}
