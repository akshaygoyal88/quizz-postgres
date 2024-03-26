import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import QuizSetCard from "@/components/QuizApp/UI/QuizSetCard";
import Heading from "@/components/Shared/Heading";
import { getQuizzesByCreatedBy } from "@/services/questionSet";
import { QuizDetail } from "@/types/types";
import { getSessionUser } from "@/utils/getSessionUser";
import { Subscription } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function Quizzes() {
  const userData = await getSessionUser();

  const allQuizzes = await getQuizzesByCreatedBy();

  return (
    <FullWidthLayout>
      <>
        <Heading headingText="Quiz" tag="h2" />
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        >
          {allQuizzes &&
            allQuizzes.map((quiz: QuizDetail) => (
              <QuizSetCard key={quiz.id} quiz={quiz} userData={userData} />
            ))}
        </ul>
      </>
    </FullWidthLayout>
  );
}
