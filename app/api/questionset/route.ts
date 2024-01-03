import { db } from "@/app/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allQuestionSets = await db.questionSet.findMany();
    return NextResponse.json(allQuestionSets);
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
        ...reqData
      },
    });
    return NextResponse.json(createSet);
  } catch (error) {
    return NextResponse.json(error);
  }
}
