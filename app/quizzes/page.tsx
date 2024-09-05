import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import QuizSetCard from "@/components/QuizApp/UI/QuizSetCard";
import Heading from "@/components/Shared/Heading";
import { getQuizzesByCreatedBy } from "@/services/questionSet";
import { getQuizsByAttemptedByUser } from "@/services/quizReport";
import { QuizDetail } from "@/types/types";
import { getSessionUser } from "@/utils/getSessionUser";
import { Subscription } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function Quizzes() {
  const userData = await getSessionUser();
  console.log(userData, "DETAILS");

  const allQuizzes = await getQuizzesByCreatedBy();
  const quizList = await getQuizsByAttemptedByUser(userData?.id);
  const isDoneList = quizList.quizzes.filter((q) => q.name !== undefined);

  const attemptedQuizIds = new Set(isDoneList.map((q) => q.id));

  const updatedQuizzes = allQuizzes.map((quiz) => ({
    ...quiz,
    isDone: attemptedQuizIds.has(quiz.id),
  }));

  console.log(updatedQuizzes);

  return (
    <FullWidthLayout>
      <>
        <Heading headingText="Quiz" tag="h2" />
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        >
          {updatedQuizzes &&
            updatedQuizzes.map((quiz: QuizDetail) => (
              <QuizSetCard key={quiz.id} quiz={quiz} userData={userData} />
            ))}
        </ul>
      </>
    </FullWidthLayout>
  );
}
