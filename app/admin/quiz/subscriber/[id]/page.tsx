import SubscribersList from "@/components/QuizApp/AdminPanel/SubscribersList";
import {
  getSubscribersByQuizId,
  updateSubscriptionOfUser,
} from "@/services/quiz";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export default async function page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { quizName?: string };
}) {
  const list = await getSubscribersByQuizId(params.id);

  return (
    <SubscribersList
      listOfSubscribers={list}
      quizName={searchParams.quizName}
    />
  );
}
