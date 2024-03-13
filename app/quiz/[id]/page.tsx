import QuizDetail from "@/components/QuizApp/UI/QuizDetail";
import pathName from "@/constants";
import { QuizService, UserSerivce } from "@/services";
import { getFirstQuesIdOfQuiz } from "@/services/questionSet";
import { QuizDetailType, UserDataType } from "@/types/types";
import { Quiz, Subscription, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({ params }: { params: Params }) {
  const session = await getServerSession();
  const quizId: string = params.id;

  const userData: UserDataType | null = await UserSerivce.getUserByEmail(
    session?.user?.email || ""
  );
  // if (!userData) {
  //   // redirect(`${pathName.login.path}`);
  //   return <>Not authenticated</>;
  // }
  // if ("error" in userData) {
  //   return <>{userData.error}</>;
  // } else {
  const isCandidateSubscribed = userData?.Subscription.find(
    (sub: Subscription) => sub.quizId === quizId
  );
  const firstQuesId = await getFirstQuesIdOfQuiz(quizId);
  const quizDetails: QuizDetailType = await QuizService.getQuizDetailByQuizId(
    quizId
  );

  return (
    <QuizDetail
      quizId={quizId}
      firstQuesId={firstQuesId}
      quizDetails={quizDetails}
      userData={userData}
      isCandidateSubscribed={isCandidateSubscribed}
    />
  );
}
// }
