import SubscribersList from "@/components/QuizApp/AdminPanel/SubscribersList";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export default function page({ params }: { params: Params }) {
  return <SubscribersList quizId={params.id} />;
}
