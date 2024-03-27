import QuizForm from "@/components/QuizApp/AdminPanel/QuizForm";
import { QuestionSetSubmitE } from "@/services/questionSet";
import { getImages } from "@/services/s3";
import { getSessionUser } from "@/utils/getSessionUser";
import React from "react";

export default async function CreateSet() {
  const userData = await getSessionUser();
  const imagesList = await getImages();
  return (
    <QuizForm
      action={QuestionSetSubmitE.CREATE}
      userData={userData!}
      imagesList={imagesList!}
    />
  );
}
