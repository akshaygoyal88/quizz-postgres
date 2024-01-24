import { db } from "@/db";
import { QuestionSet } from "@prisma/client";
import { NextResponse } from "next/server";

export async function getAllQuestionsSet({
  skip,
  pageSize,
  createdById,
}: {
  skip: number;
  pageSize: number;
  createdById: string;
}) {
  return await db.questionSet.findMany({
    where: {
      isDeleted: false,
      createdById,
    },
    include: {
      createdBy: true,
    },
    skip,
    take: pageSize,
  });
}
export async function getQuestionSets(createdById?: string) {
  return await db.questionSet.findMany({
    where: {
      createdById,
      isDeleted: false,
    },
    include: {
      createdBy: true,
    },
  });
}

export enum QuestionSetSubmitE {
  CREATE="create",
  EDIT="edit",
} 

export async function createQuestionSet({
  name,
  description,
  action,
  price,
  createdById,
}: {
  name: string;
  description?: string;
  createdById: string;
  action?: string;
  price?: number;
}) {
  if (!createdById) {
    return { error: "In valid user please log in." };
  }
  if (!name) {
    return { error: "Please enter name" };
  }
  
  return await db.questionSet.create({
    data: {
      name,
      description,
      createdById,
      action,
      price: parseFloat(price)
    },
  });
}

export async function editQuestionSet({
  id,
  reqData,
}: {
  id:string;
  reqData: QuestionSet
}) {
  const isAvailable = await db.questionSet.findUnique({
    where: { id },
  });
  if(!id || !isAvailable){
    return { error: "Question/set not available" };
  }
  return await db.questionSet.update({
    where: {
      id,
    },
    data: { ...reqData },
  });
}

export async function getQuesSetVailable({ setId }: { setId: string }) {
  return await db.questionSet.findUnique({
    where: {
      id: setId,
    },
  });
}

