import QuizReport from "@/components/QuizApp/UI/QuizReport";
import React from "react";

async function page({ params }) {
  const id = params.Id;
  return <QuizReport userId={id} />;
}

export default page;
