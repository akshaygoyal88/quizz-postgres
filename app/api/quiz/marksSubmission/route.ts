import { QuizReportsService } from "@/services";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response){
    const { marks, reportId } = await req.json();
    const markRes = await QuizReportsService.markSubmitByAdmin({ marks, reportId });
    return NextResponse.json(markRes)

}