import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizListUI from "@/components/QuizApp/AdminPanel/QuizListUI";
import { isUnauthorised } from "@/utils/isUnauthorised";
import { getSession } from "next-auth/react";

import React from "react";

export default async function User() {
  await isUnauthorised("/signin");
  return <QuizListUI />;
}
