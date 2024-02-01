"use server";

import { QuestionSubmitE, createQuestion, editQuestions } from "@/services/questions";

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
    setId: rawFormData.setId,
    type: rawFormData.questionType,
    options: optionsArray,
    question_text: rawFormData.question,
    questionType: rawFormData.questionType,
    timer: rawFormData.timer,
    correctAnswer: rawFormData.correctAnswer,
    createdById: rawFormData.createdById,
    editorContent: rawFormData.editorContent,
  };
  switch (action) {
    case QuestionSubmitE.ADD:
    return await createQuestion(reqData);

    case QuestionSubmitE.EDIT:
    return await editQuestions({id: rawFormData.id, reqData});

    default:
      return { error: "Invalid action" };
  }
}
