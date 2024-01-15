import { getQuiz } from "@/Services/questionSet";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(params:string) {
    const setId: string = params?.id;

    if(!setId){
        return NextResponse.json({error: "Invalid quiz set."});
    }

    const getQuizAndQues = await getQuiz({setId})

    return NextResponse.json({questions: [...getQuizAndQues]})
}