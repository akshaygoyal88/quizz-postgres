import LeftSideBar from "@/components/Layout/LeftSidebar";
import EditSetForm from "@/components/QuizApp/EditSetForm";
import React from "react";

export default function EditSet({ params }) {
  //   console.log(params);
  return (
    <LeftSideBar>
      <EditSetForm setId={params.id} />
    </LeftSideBar>
  );
}
