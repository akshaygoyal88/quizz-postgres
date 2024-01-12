import { db } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any, { params }) {
  const id = params.id;

  const setData = await db.questionSet.findUnique({
    where: { id },
  });

  return NextResponse.json(setData);
}

export async function DELETE(req: any, res: any) {
  let err;
  try {
    const url = new URL(req.url);

    const id = `${url.pathname.split("/").pop()}`;

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
    const id = `${url.pathname.split("/").pop()}`;

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
