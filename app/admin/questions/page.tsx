import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuestionsListUI from "@/components/QuizApp/QuestionsListUI";
import React from "react";

export default function Questions() {
  return (
    <LeftSideBar>
      <QuestionsListUI />
    </LeftSideBar>
  );
}
