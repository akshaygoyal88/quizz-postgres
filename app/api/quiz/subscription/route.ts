import { createSubscriptionOfQuiz } from "@/services/quiz";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response){
    const reqData = await req.json();
    const subscriptionRes = await createSubscriptionOfQuiz(reqData);
    return NextResponse.json(subscriptionRes);
}