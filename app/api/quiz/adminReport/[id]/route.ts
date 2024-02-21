
import { db } from "@/db";
import { QuizReportsService } from "@/services";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params:string}) {
    const quizId = params.id;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "0", 10);

    try {
      
          const totalRows = await db.userReportOfQuiz.count({
            where: {
              quizId          
            },
          });
    
          const totalPages = Math.ceil(totalRows / pageSize);
    
          const skip = (page - 1) * pageSize;
          const quizResByUser = await QuizReportsService.getReportsByQuizId({skip, pageSize, quizId});
          return new Response(
            JSON.stringify({ quizResByUser, totalPages, totalRows }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      } catch (error) {
        return NextResponse.json({ error });
      }
    
    // return NextResponse.json(res);
}