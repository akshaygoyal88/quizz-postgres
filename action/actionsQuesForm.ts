"use server";

import { QuestionSubmitE, createQuestion, editQuestions } from "@/services/questions";
import { QuestionType } from "@prisma/client";

export async function handleQuestionSubmit(
  formData: FormData,
  action: QuestionSubmitE
) {
  const rawFormData = Object.fromEntries(formData.entries());
  console.log(rawFormData);

  const optionsArray = [];
  const quizIds = [];
  const correctAnswer = [];
  for (let key in rawFormData) {
    if(key.includes("correctAnswer_")){
      correctAnswer.push(Number(rawFormData[key]))
    }
    if (key.includes("questionOptions_")) {
      optionsArray.push([rawFormData[key]]);
    }
    if (key.includes("quizId_")) {
      quizIds.push(rawFormData[key]);
    }
  }

  for(let i = 0; i<optionsArray.length; i++){
    if(rawFormData[`option_marks_${i}`]){
      optionsArray[i].push(rawFormData[`option_marks_${i}`]);
    }
  }

  const reqData = {
    id:rawFormData.id,
    quizIds: quizIds,
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
  console.log(reqData, "dsfdfds")
  switch (action) {
    case QuestionSubmitE.ADD:
    return await createQuestion(reqData);

    case QuestionSubmitE.EDIT:
    return await editQuestions(reqData);

    default:
      return { error: "Invalid action" };
  }
}
