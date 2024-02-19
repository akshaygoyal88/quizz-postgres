import QuizReport from "@/components/QuizApp/UI/QuizReport";
import React from "react";

function page({ params }) {
  const id = params.Id;
  return <QuizReport />;
}

export default page;
