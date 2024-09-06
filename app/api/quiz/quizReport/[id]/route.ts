import { QuizReportsService } from "@/services";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Params }) {
  const submittedBy = params.id;
  console.log(submittedBy);
  const res = await QuizReportsService.getQuizsByAttemptedByUser(submittedBy);
  return NextResponse.json(res);
}
