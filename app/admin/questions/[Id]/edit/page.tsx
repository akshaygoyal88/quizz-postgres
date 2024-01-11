import EditQuesForm from "@/components/QuizApp/EditQuesForm";
import React from "react";

export default function QuesEdit({ params }) {
  console.log(params.Id);
  return <EditQuesForm quesId={params.Id} />;
}
