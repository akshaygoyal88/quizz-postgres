import { Container } from "@/components/Container";
import QuizForm from "@/components/QuizApp/AdminPanel/QuizForm";
import { QuestionSetSubmitE } from "@/services/questionSet";
import { getQuizByQuizId } from "@/services/quiz";
import { getImages } from "@/services/s3";
import { getSessionUser } from "@/utils/getSessionUser";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function EditSet({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { msg: string };
}) {
  const userData = await getSessionUser();
  const quizId = params.id;
  const quizDetails: any = await getQuizByQuizId(quizId);
  const imagesList: any = await getImages();
  const addSetSuccessMessage =
    searchParams?.msg === "1" ? "Successfully added" : null;

  return (
    <Container>
      <QuizForm
        userData={userData!}
        action={QuestionSetSubmitE.EDIT}
        imagesList={imagesList}
        initialFormData={quizDetails}
        addSetSuccessMessage={addSetSuccessMessage}
      />
    </Container>
  );
}
