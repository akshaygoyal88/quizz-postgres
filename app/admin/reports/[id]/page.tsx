import LeftSideBar from "@/components/Layout/LeftSidebar";
import QuizQuesSummary from "@/components/QuizApp/AdminPanel/QuizQuesSummary";
import { isUnauthorised } from "@/utils/isUnauthorised";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: Params) {
  await isUnauthorised("/signin");
  const reportId = params.id;
  return <QuizQuesSummary reportId={reportId} />;
}
