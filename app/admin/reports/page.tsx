import LeftSideBar from "@/components/Layout/LeftSidebar";
import AdminReportPage from "@/components/QuizApp/AdminPanel/AdminReportPage";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function page() {
  await isUnauthorised("/signin");
  return (
    <LeftSideBar>
      <AdminReportPage />
    </LeftSideBar>
  );
}
