import LeftSideBar from "@/components/Layout/LeftSidebar";
import CreateSetForm from "@/components/QuizApp/CreateSetForm";
import { isAdmin } from "@/utils/isAdmin";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function CreateSet() {
  await isUnauthorised("/signin");
  return (
    <LeftSideBar>
      <CreateSetForm />
    </LeftSideBar>
  );
}
