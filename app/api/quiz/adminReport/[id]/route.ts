import { db } from "@/db";
import { QuizReportsService } from "@/services";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Params }) {
  const quizId = params.id;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "0", 10);

  try {
    const totalRows = await db.userQuizReport.count({
      where: {
        quizId,
      },
    });

    const totalPages = Math.ceil(totalRows / pageSize);

    const skip = (page - 1) * pageSize;
    const result = await QuizReportsService.getReportsByQuizId({
      skip,
      pageSize,
      quizId,
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json({ error });
  }

  // return NextResponse.json(res);
}
