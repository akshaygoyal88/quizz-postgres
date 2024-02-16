import LeftSideBar from "@/components/Layout/LeftSidebar";
import AddQuestionUI from "@/components/QuizApp/AddQuestionUI";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function QuestionsAdd() {
  await isUnauthorised("/signin");
  return (
    <LeftSideBar>
      <AddQuestionUI />
    </LeftSideBar>
  );
}
