import { db } from "@/db";
import { QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params:string}) {
  let err;
  try {
    const id = params.id
    const isAvailable = await db.question.findUnique({
      where: { id },
      include: {
        objective_options: true,
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
    const id = url.pathname.split("/").pop();

    const isAvailable = await db.question.findUnique({
      where: { id },
      include: {
        objective_options: true,
      },
    });

    if (isAvailable) {
      await Promise.all([
        ...isAvailable.objective_options.map((opt) =>
          db.objectiveOptions.delete({ where: { id: opt.id } })
        )
      ]);

      const deleteQue = await db.question.delete({
        where: { id },
      });
      return NextResponse.json(deleteQue);
    } else {
      err = "Invalid question";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req: Request, {params}: {params:string}) {
  let err;
  try {
    const id = params.id

    const {
      question_text,
      type,
      questionSet,
      options,
      correctAnswer,
      description,
      timer,
      isDeleted,
    } = await req.json();

    const isAvailable = await db.question.findUnique({
      where: { id },
    });

    const setsAvailable = await db.questionSet.findMany();
    const setDetail = setsAvailable.filter((set) => set.name === questionSet);

    if(!isDeleted && setDetail.length == 0 ) {
      return NextResponse.json({ error: "Please provide question set." });
    }

    if (isAvailable) {

      const deleteOptions = await db.objectiveOptions.deleteMany({
        where: { questionId: id },
      });

      if(isDeleted) {
        const deleteQue = await db.question.update({
          where: { id },
          data: {
            isDeleted
          },
        });
        return NextResponse.json(deleteQue);
      } else {
        
        if (type === QuestionType.OBJECTIVE) {
          const updateQue = await db.question.update({
            where: { id },
            data: {
              question_text,
              type,
              timer: parseInt(timer, 10),              
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
              timer: parseInt(timer, 10),              
            },
          });
  
          return NextResponse.json(updateQue);
        }
      }


     
    } else {
      err = "Invalid Question";
      return NextResponse.json({ error: err });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
