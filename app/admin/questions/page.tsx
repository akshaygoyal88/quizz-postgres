import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuestionsListUI from "@/components/QuizApp/QuestionsListUI";
import { isAdmin } from "@/utils/isAdmin";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function Questions() {
  await isUnauthorised("/signin");

  return (
    <LeftSideBar>
      <QuestionsListUI />
    </LeftSideBar>
  );
}
