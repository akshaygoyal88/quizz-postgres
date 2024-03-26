import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import QuestionsListUI from "@/components/QuizApp/AdminPanel/QuestionsListUI";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function Questions() {
  await isUnauthorised("/signin");
  return <QuestionsListUI />;
}
