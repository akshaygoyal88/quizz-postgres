import QuizReport from "@/components/QuizApp/UI/QuizReport";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: Params) {
  return <QuizReport userId={params.userId} />;
}
