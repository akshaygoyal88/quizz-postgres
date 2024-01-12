import EditSetForm from "@/components/QuizApp/EditSetForm";
import React from "react";

export default function EditSet({ params }) {
  //   console.log(params);
  return <EditSetForm setId={params.id} />;
}
