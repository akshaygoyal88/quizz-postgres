import LeftSideBar from "@/components/Layout/LeftSidebar";
import CreateSetForm from "@/components/QuizApp/CreateSetForm";
import React from "react";

export default function CreateSet() {
  return (
    <LeftSideBar>
      <CreateSetForm />
    </LeftSideBar>
  );
}
