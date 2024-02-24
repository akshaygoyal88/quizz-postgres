import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizQuesSummary from "@/components/QuizApp/QuizQuesSummary";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function page({ params }) {
  await isUnauthorised("/signin");
  const reportId = params.id;
  return (
    <LeftSideBar>
      <QuizQuesSummary reportId={reportId} />
    </LeftSideBar>
  );
}
