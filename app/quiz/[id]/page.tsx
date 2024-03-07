import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import TestLayout from "@/components/QuizApp/UI/TestLayout";
import { QuizReportsService } from "@/services";
import { getQuizQuestions } from "@/services/quiz";
import { getUserByEmail } from "@/services/user";
import { QuizQuestions } from "@prisma/client";
import React from "react";

export default async function QuizTestPage({ params }: { params: string }) {
  // const allQuizQuestions = await getQuizQuestions({ quizId: params.id });
  // const allQuestions = allQuizQuestions.map(
  //   (ques: QuizQuestions) => ques.question
  // );

  // if (allQuizQuestions.length > 0) {
  //   return (
  //     <FullWidthLayout>
  //       <TestLayout
  //         allQuestions={allQuestions}
  //         allQuizQuestions={allQuizQuestions}
  //         quizId={params?.id}
  //       />
  //     </FullWidthLayout>
  //   );
  // } else {
  //   return <>ERROR COMPONENT</>;
  // }
  return <div>h</div>;
}
