import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizCreation from "@/components/QuizApp/QuizCreation";
import React from "react";

export default function User() {
  return (
    <LeftSideBar>
      <QuizCreation />
    </LeftSideBar>
  );
}
