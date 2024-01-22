"use server";

import { QuestionSubmitE, createQuestion } from "@/services/questions";

export async function handleQuestionSubmit(
  formData: FormData,
  action: QuestionSubmitE
) {
  const rawFormData = Object.fromEntries(formData.entries());
  console.log(rawFormData);
  const optionsArray = [];
  for (let key in rawFormData) {
    if (key.includes("questionOptions_")) {
      optionsArray.push(rawFormData[key]);
    }
  }

  const reqData = {
    type: rawFormData.questionType,
    objective_options: optionsArray,
    question_text: rawFormData.question,
    questionType: rawFormData.questionType,
    timer: rawFormData.timer,
    correctAnswer: rawFormData.correctAnswer,
    createdById: rawFormData.createdById
  };
  console.log(reqData)
  switch (action) {
    case QuestionSubmitE.ADD:
    return await createQuestion(reqData);

    case QuestionSubmitE.EDIT:
    // return await editQuestionSet({id: rawFormData.id, reqData: rawFormData});

    default:
      return { error: "Invalid action" };
  }
}
