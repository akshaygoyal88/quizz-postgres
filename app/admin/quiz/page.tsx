import QuizList from "@/components/QuizApp/AdminPanel/QuizList";
import { getQuizzesWithPaginationByCreatedBy } from "@/services/questionSet";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function User({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    pageSize?: string;
  };
}) {
  const userData = await getSessionUser();
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 9;
  const skip = (page - 1) * pageSize;
  const createdById = userData?.id!;
  const result = await getQuizzesWithPaginationByCreatedBy({
    createdById,
    pageSize,
    skip,
  });
  return (
    <QuizList
      quizzes={result.quizzes}
      totalPages={result.totalPages}
      totalRows={result.totalRows}
    />
  );
}
