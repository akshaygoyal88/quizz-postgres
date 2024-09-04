import { db } from "@/db";
import { updateQuiz } from "@/services/quiz";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Params }) {
  const id = params.id;
  const setData = await db.quiz.findUnique({
    where: { id },
  });
  return NextResponse.json(setData);
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  let err;
  try {
    const id = params.id;

    console.log(id, "delete id");
    const isAvailable = await db.quiz.findUnique({
      where: { id },
    });
    console.log(isAvailable, " isAvailable");
    if (isAvailable) {
      const deleteSet = await db.quiz.delete({
        where: {
          id,
        },
      });

      console.log(deleteSet, " console.log(deleteSet);");

      return NextResponse.json(deleteSet);
    } else {
      err = "Invalid Set";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const id = params.id;
  const reqData = await req.json();
  const res = await updateQuiz({ id, ...reqData });
  return NextResponse.json(res);
}
