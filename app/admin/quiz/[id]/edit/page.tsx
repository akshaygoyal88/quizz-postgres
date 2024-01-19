import LeftSideBar from "@/components/Layout/LeftSidebar";
import EditSetForm from "@/components/QuizApp/EditSetForm";
import { isAdmin } from "@/utils/isAdmin";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function EditSet({ params }) {
  await isUnauthorised("/signin");
  return (
    <LeftSideBar>
      <EditSetForm setId={params.id} />
    </LeftSideBar>
  );
}
