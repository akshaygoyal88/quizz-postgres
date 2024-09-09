import { Container } from "@/components/Container";
import QuizSetting from "@/components/QuizApp/AdminPanel/QuizSetting";
import { getQuizByQuizId } from "@/services/quiz";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function page({ params }: { params: Params }) {
  const quizId = params.id;
  const quizSettingData: any = await getQuizByQuizId(quizId);

  return (
    <Container>
      <QuizSetting quizId={quizId} quizSettingData={quizSettingData} />
    </Container>
  );
}
