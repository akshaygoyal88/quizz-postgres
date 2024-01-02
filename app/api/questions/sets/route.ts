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
    const { set_name, description } = await req.json();

    const createSet = await db.questionSet.create({
      data: {
        set_name,
        description,
      },
    });
    return NextResponse.json(createSet);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req: any, res: any) {
  let err;
  try {
    const url = new URL(req.url);

    const id = Number(url.searchParams.get("id"));

    const isAvailable = await db.questionSet.findUnique({
      where: { id },
    });

    if (isAvailable) {
      const deleteSet = await db.questionSet.delete({
        where: {
          id,
        },
      });
      return NextResponse.json(deleteSet);
    } else {
      err = "Invalid Set";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req: any, res: any) {
  let err;
  try {
    const url = new URL(req.url);

    const id = Number(url.searchParams.get("id"));

    const reqData = await req.json();

    const isAvailable = await db.questionSet.findUnique({
      where: { id },
    });

    if (isAvailable) {
      const updateSet = await db.questionSet.update({
        where: {
          id,
        },
        data: { ...reqData },
      });
      return NextResponse.json(updateSet);
    } else {
      err = "Invalid Set";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
