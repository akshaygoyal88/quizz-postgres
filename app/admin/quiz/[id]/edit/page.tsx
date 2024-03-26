import LeftSideBar from "@/components/Layout/LeftSidebar";
import EditSetForm from "@/components/QuizApp/AdminPanel/EditSetForm";
import { isAdmin } from "@/utils/isAdmin";
import { isUnauthorised } from "@/utils/isUnauthorised";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function EditSet({ params }: { params: Params }) {
  await isUnauthorised("/signin");
  return <EditSetForm setId={params.id} />;
}
