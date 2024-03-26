import AddQuestionUI from "@/components/QuizApp/AdminPanel/AddQuestionUI";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function QuestionsAdd() {
  await isUnauthorised("/signin");
  return <AddQuestionUI />;
}
