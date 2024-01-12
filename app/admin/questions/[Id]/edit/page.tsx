import EditQuesForm from "@/components/QuizApp/EditQuesForm";
import React from "react";

export default function QuesEdit({ params }) {
  return <EditQuesForm quesId={params.Id} />;
}
