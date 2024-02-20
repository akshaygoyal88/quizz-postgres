import { QuizReportsService } from "@/services";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params:string}) {

    const submittedBy = params.id;
    console.log(submittedBy);
    const res = await QuizReportsService.getReportsBySubmittedBy(submittedBy);
    return NextResponse.json(res);
    
}