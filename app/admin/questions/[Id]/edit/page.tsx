import EditQuesForm from "@/components/QuizApp/EditQuesForm";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function QuesEdit({ params }) {
  await isUnauthorised("/signin");
  return <EditQuesForm quesId={params.Id} />;
}
