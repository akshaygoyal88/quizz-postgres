import LeftSideBar from "@/components/Layout/LeftSidebar";
import AdminReportPage from "@/components/QuizApp/AdminReportPage";
import React from "react";

export default function page() {
  return (
    <LeftSideBar>
      <AdminReportPage />
    </LeftSideBar>
  );
}
