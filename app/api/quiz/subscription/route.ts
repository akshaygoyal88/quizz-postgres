import { QuizService } from "@/services";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response){
    const reqData = await req.json();
    const subscriptionRes = await QuizService.createSubscriptionOfQuiz(reqData);
    return NextResponse.json(subscriptionRes);
}