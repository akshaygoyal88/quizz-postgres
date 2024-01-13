import EditSetForm from "@/components/QuizApp/EditSetForm";
import { isUnauthorised } from "@/utils/isUnauthorised";
import React from "react";

export default async function EditSet({ params }) {
  //   console.log(params);
  await isUnauthorised("/signin");
  return <EditSetForm setId={params.id} />;
}
