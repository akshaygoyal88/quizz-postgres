import LeftSideBar from "@/components/Layout/LeftSidebar";
import EditQuesForm from "@/components/QuizApp/EditQuesForm";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default function QuesEdit({ params }) {
  return (
    <LeftSideBar>
      <EditQuesForm quesId={params.Id} />
    </LeftSideBar>
  );
}
