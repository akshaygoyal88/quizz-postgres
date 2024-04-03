import { Container } from "@/components/Container";
import QuestionForm from "@/components/QuizApp/AdminPanel/QuestionForm";
import { getQuizzesByCreatedBy } from "@/services/questionSet";
import { QuestionSubmitE } from "@/services/questions";
import { getImages } from "@/services/s3";
import { getSessionUser } from "@/utils/getSessionUser";
import React from "react";

export default async function QuestionsAdd() {
  const userData = await getSessionUser();
  const quizzes = await getQuizzesByCreatedBy();
  const imagesList = await getImages();
  return (
    <Container>
      <QuestionForm
        quizzes={quizzes}
        headingText="Add Questions"
        buttonText="Save"
        action={QuestionSubmitE.ADD}
        objAnsType={"SINGLECHOICE"}
        imagesList={imagesList}
        userData={userData}
      />
    </Container>
  );
}
