import { Container } from "@/components/Container";
import QuestionForm from "@/components/QuizApp/AdminPanel/QuestionForm";
import { getQuizzesByCreatedBy } from "@/services/questionSet";
import { QuestionSubmitE, getQuestionByQuestionId } from "@/services/questions";
import { getImages } from "@/services/s3";
import { getSessionUser } from "@/utils/getSessionUser";
import { ObjectiveOptions, QuestionType } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

export default async function QuesEdit({ params }: { params: Params }) {
  const userData = await getSessionUser();
  const quizzes = await getQuizzesByCreatedBy();
  const imagesList: any = await getImages();
  const questionData: any = await getQuestionByQuestionId(params.Id);
  let options: string[] = [];
  let marksOfOption: (number | null)[] = [];
  let correctAnsList: string[] = [];

  if (questionData) {
    questionData.objective_options.forEach((ele: any, index: number) => {
      options.push(ele.text);
      const mark = ele.option_marks;
      if (mark !== null && mark !== undefined) {
        marksOfOption.push(mark);
      }
      if (ele.isCorrect) {
        correctAnsList.push(`${index}`);
      }
    });
  }

  return (
    <Container>
      <QuestionForm
        quizzes={quizzes}
        headingText="Edit Questions"
        buttonText="Update"
        action={QuestionSubmitE.EDIT}
        imagesList={imagesList}
        userData={userData}
        quesId={params.Id}
        editQuestionData={questionData}
        editQuesOptions={options}
        correctAnsList={correctAnsList}
        marksOfOption={marksOfOption}
        objAnsType={"SINGLECHOICE"}
      />
    </Container>
  );
}
