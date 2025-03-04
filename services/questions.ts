import { db } from "@/db";
import { QuestionType } from "@prisma/client";
import { Question } from "@prisma/client";

export async function getAllQuestions({
  skip,
  pageSize,
  createdById,
}: {
  skip: number;
  pageSize: number;
  createdById: string;
}) {
  const totalRows = await db.question.count({
    where: {
      isDeleted: false,
      createdById,
    },
  });

  const totalPages = Math.ceil(totalRows / pageSize);

  const questions = await db.question.findMany({
    where: {
      isDeleted: false,
      createdById,
    },
    include: {
      objective_options: true,
      createdBy: true,
    },
    skip,
    take: pageSize,
  });
  return { questions, totalPages, totalRows };
}

export enum QuestionSubmitE {
  ADD = "add",
  EDIT = "edit",
}

export async function createQuestion(
  reqData: Question & {
    quizIds: string[];
    options: string[][] | [];
    correctAnswer: string[] | [];
  }
) {
  const {
    quizIds,
    type,
    options,
    correctAnswer,
    solution,
    timer,
    createdById,
    editorContent,
    answer_type,
  } = reqData;

  if (!editorContent) {
    return { error: "Please enter question." };
  }
  if (quizIds.length === 0) {
    return { error: "Please provide Quiz." };
  }
  if (type === QuestionType.OBJECTIVE && options.length == 0) {
    return { error: "Please enter couple of option" };
  }
  const addQuestion = await db.question.create({
    data: {
      editorContent,
      type,
      timer: parseInt(`${timer}`, 10),
      objective_options:
        //   type === QuestionType.OBJECTIVE ?
        {
          createMany: {
            data: options.map((option: [string, string], index: number) => {
              const isCorrect = isAnswerCorrect(index, correctAnswer);
          
              return {
                text: option[0],
                isCorrect,
                option_marks: parseFloat(option[1]),
              };
            }),
          },
          
        },
      // : undefined,
      solution,
      answer_type,
      createdById,
    },
  });
  const createdBy = createdById;
  const questionId = addQuestion.id;

  const quizAdd = await db.quizQuestions.createMany({
    data: quizIds.map((quizId) => ({
      quizId,
      questionId,
      createdBy,
    })),
  });

  return { addQuestion, quizAdd };
}

export async function editQuestions(
  reqData: Question & {
    quizIds: string[];
    options: string[][] | [];
    correctAnswer: string[] | [];
  }
) {
  const {
    id,
    quizIds,
    type,
    options,
    correctAnswer,
    solution,
    timer,
    editorContent,
    answer_type,
    createdById,
  } = reqData;

  if (quizIds.length === 0) {
    return { error: "Please provide Quiz." };
  }
  const isAvailable = await db.question.findUnique({
    where: { id },
  });

  if (isAvailable) {
    type === QuestionType.OBJECTIVE &&
      (await db.objectiveOptions.deleteMany({
        where: { questionId: id },
      }));
    const editQues = await db.question.update({
      where: { id },
      data: {
        editorContent,
        type,
        timer: parseInt(`${timer}`, 10),
        objective_options:
          type === QuestionType.OBJECTIVE
            ? {
                createMany: {
                  data: options.map((option: any, index: number) => {
                    const isCorrect = isAnswerCorrect(index, correctAnswer);
                    return {
                      text: option[0],
                      isCorrect,
                      option_marks: parseFloat(option[1]),
                    };
                  }),
                },
              }
            : undefined,
        solution,
        answer_type,
      },
    });

    const createdBy = createdById;
    const questionId = editQues.id;

    for (const quizId of quizIds) {
      const existingRecord = await db.quizQuestions.findFirst({
        where: {
          quizId,
          questionId,
          createdBy,
        },
      });
      if (!existingRecord) {
        const quizAdd = await db.quizQuestions.create({
          data: {
            quizId,
            questionId,
            createdBy,
          },
        });
      }
    }

    return editQues;
  } else {
    return { error: "Invalid question" };
  }
}

export async function getQuestionByQuestionId(id: string) {
  if (!id) {
    return { error: "Question ID not provided." };
  }
  return await db.question.findUnique({
    where: { id },
    include: {
      objective_options: true,
    },
  });
}

export async function getQuestionByIds(ids: string[]) {
  if (ids.length <= 0) {
    return { error: "Question ID not provided." };
  }
  return await db.question.findMany({
    where: { id: { in: ids } },
    include: {
      objective_options: true,
    },
  });
}

function isAnswerCorrect(index: number, correctAnswer: any[]): boolean {
  return correctAnswer.includes(index);
}
