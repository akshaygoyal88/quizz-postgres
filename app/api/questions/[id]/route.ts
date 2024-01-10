import { db } from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
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
        questionSets: true,
      },
    });

    if (isAvailable) {
      return NextResponse.json(isAvailable);
    } else {
      err = "Invalid question";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

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

    const {
      question_text,
      type,
      questionSet,
      options,
      correctAnswer,
      description,
    } = await req.json();

    console.log('quws', type)

    const isAvailable = await db.question.findUnique({
      where: { id },
    });

    const setsAvailable = await db.questionSet.findMany();
    const setDetail = setsAvailable.filter((set) => set.name === questionSet);

    if (isAvailable) {

      const deleteOptions = await db.objectiveOptions.deleteMany({
        where: { questionId: id },
      });
      

      console.log("deleteOptions", deleteOptions);

      if (type === "OBJECTIVE") {
        const updateQue = await db.question.update({
          where: { id },
          data: {
            question_text,
            type,
            questionSets: {
              connect: { id: setDetail[0].id },
            },
            objective_options: {
              createMany: {
                data: options.map((optionText: any, index: any) => ({
                  text: optionText,
                  isCorrect: index === correctAnswer,
                })),
              },
            },
          },
        });
        return NextResponse.json(updateQue);
      } else {
        const problem = question_text;
        const updateQue = await db.question.update({
          where: { id },
          data: {
            question_text,
            type,
            questionSets: {
              connect: { id: setDetail[0].id },
            },
            subjective_description: {
              create: {
                problem,
                description,
              },
            },
          },
        });

        return NextResponse.json(updateQue);
      }
    } else {
      err = "Invalid Question";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
