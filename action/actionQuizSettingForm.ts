"use server";

import { updateQuiz } from "@/services/quiz";
import { Quiz } from "@prisma/client";

export async function handleQuizSettingForm(formData: FormData) {
  const {
    id,
    select,
    cut,
    copy,
    paste,
    newWindow,
    newTab,
    globalTimer,
    quizSubmissionMessage,
  } = Object.fromEntries(formData.entries()) as {
    select: string;
    cut: string;
    copy: string;
    paste: string;
    newWindow: string;
    newTab: string;
    globalTimer: string;
    quizSubmissionMessage: string;
    id:string;
  };

  const parseBoolean = (str) => {
    return str === "true" ? true : false;
  }

  const reqData =  {
    id,
    select: parseBoolean(select),
    cut: parseBoolean(cut),
    copy: parseBoolean(copy),
    paste: parseBoolean(paste),
    newWindow: parseBoolean(newWindow),
    newTab: parseBoolean(newTab),
    globalTimer: parseInt(globalTimer),
    quizSubmissionMessage
  }

    return await updateQuiz(reqData);
}
