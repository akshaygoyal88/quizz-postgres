import { db } from "@/app/db";
import { NextResponse } from "next/server";

export async function DELETE(req: any, res: any) {
  let err;
  try {
    const url = new URL(req.url);
    //   const id = `${url.pathname.split('/').pop()}`;
    const id = parseInt(url.pathname.split("/").pop());

    const isAvailable = await db.question.findUnique({
        where: { id },
        include: {
          objective_options: true,
          subjective_description: true,
        },
      });

    if (isAvailable) {

        await Promise.all([
            ...isAvailable.objective_options.map((opt) =>
              db.objectiveOptions.delete({ where: { id: opt.id } })
            ),
            ...isAvailable.subjective_description.map((desc) =>
              db.subjectiveDescription.delete({ where: { id: desc.id } })
            ),
          ]);

      const deleteQue = await db.question.delete({
        where: { id },
      });
      console.log("deleteQue", deleteQue);
      return NextResponse.json(deleteQue);
    } else {
      err = "Invalid question";
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
    // const id = `${url.pathname.split("/").pop()}`;
    const id = parseInt(url.pathname.split("/").pop());

    const reqData = await req.json();
    console.log("questions", reqData);

    const isAvailable = await db.question.findUnique({
      where: { id },
    });

    if (isAvailable) {
      const updateQue = await db.question.update({
        where: {
          id,
        },
        data: { ...reqData },
      });
      return NextResponse.json(updateQue);
    } else {
      err = "Invalid Question";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
