"use server";

import { saveResponseForQues } from "@/services/answerSubmission";
import { UserQuizAnswerStatus } from "@prisma/client";

export async function handleAnsSubmission(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  rawFormData["status"] = rawFormData.ans_optionsId
    ? UserQuizAnswerStatus.ATTEMPTED
    : UserQuizAnswerStatus.SKIPPED;
  const res = await saveResponseForQues(rawFormData);
  return res;
}
