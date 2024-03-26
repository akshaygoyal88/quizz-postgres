import AddQuestionUI from "@/components/QuizApp/AdminPanel/AddQuestionUI";
import { getQuizzesByCreatedBy } from "@/services/questionSet";
import { getSessionUser } from "@/utils/getSessionUser";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function QuestionsAdd() {
  const userData = await getSessionUser();
  const quizzes = await getQuizzesByCreatedBy();
  return <AddQuestionUI userData={userData!} quizzes={quizzes} />;
}
