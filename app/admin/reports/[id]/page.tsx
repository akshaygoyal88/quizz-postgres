import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizQuesSummary from "@/components/QuizApp/QuizQuesSummary";
import React from "react";

export default function page({ params }) {
  const reportId = params.id;
  return (
    <LeftSideBar>
      <QuizQuesSummary reportId={reportId} />
    </LeftSideBar>
  );
}
