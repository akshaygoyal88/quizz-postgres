import authorization from "@/app/authorization";
import QuizCreation from "@/components/QuizApp/QuizCreation";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function User() {
  await isUnauthorised("/signin");
  return <QuizCreation />;
}
