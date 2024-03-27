"use server";

import { QuestionSubmitE, createQuestion, editQuestions } from "@/services/questions";

export async function handleQuestionSubmit(
  formData: FormData,
  action: QuestionSubmitE
) {
  const rawFormData = Object.fromEntries(formData.entries());

  const optionsArray = [];
  for (let key in rawFormData) {
    if (key.includes("questionOptions_")) {
      optionsArray.push(rawFormData[key]);
    }
  }

  const correctAnswer = [];
  for (let key in rawFormData) {
    if(key.includes("correctAnswer_")){
      correctAnswer.push(Number(rawFormData[key]))
    }
  }

  const reqData = {
    quizId: rawFormData.quizId,
    type: rawFormData.questionType,
    options: optionsArray,
    questionType: rawFormData.questionType,
    timer: rawFormData.timer,
    correctAnswer: correctAnswer,
    createdById: rawFormData.createdById,
    solution: rawFormData.solution,
    editorContent: rawFormData.editorContent,
    answer_type: rawFormData.answer_type,
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
