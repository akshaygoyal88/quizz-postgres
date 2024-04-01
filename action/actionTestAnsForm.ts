"use server";

import { saveResponseForQues } from "@/services/answerSubmission";
import { UserQuizAnswerStatus } from "@prisma/client";

export async function handleAnsSubmission(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

const otherFormData: any = {};
const ans_optionsId = [];

for (const [key, value] of Object.entries(rawFormData)) {
  if (key.includes("ans_optionsId_")) {
    ans_optionsId.push(value)
  } else {
    otherFormData[key] = value;
  }
}

const reqData = {...otherFormData, ans_optionsId}

reqData["status"] = (reqData.ans_optionsId.length>0 || (reqData.ans_subjective && reqData.ans_subjective.length>0))
    ? UserQuizAnswerStatus.ATTEMPTED
    : UserQuizAnswerStatus.SKIPPED;
  const res = await saveResponseForQues(reqData);
  return res;
}
