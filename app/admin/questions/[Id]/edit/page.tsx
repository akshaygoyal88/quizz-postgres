import LeftSideBar from "@/components/Layout/LeftSidebar";
import EditQuesForm from "@/components/QuizApp/AdminPanel/EditQuesForm";
import { isUnauthorised } from "@/utils/isUnauthorised";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function QuesEdit({ params }: Params) {
  await isUnauthorised("/signin");
  return <EditQuesForm quesId={params.Id} />;
}
