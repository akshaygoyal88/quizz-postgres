import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizCreation from "@/components/QuizApp/QuizCreation";
import { isUnauthorised } from "@/utils/isUnauthorised";
import { getSession } from "next-auth/react";

import React from "react";

export default async function User() {
  await isUnauthorised("/signin");
  return (
    <LeftSideBar>
      <QuizCreation />
    </LeftSideBar>
  );
}
