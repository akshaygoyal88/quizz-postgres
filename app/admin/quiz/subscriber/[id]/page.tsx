import LeftSideBar from "@/components/Layout/LeftSidebar";
import SubscribersList from "@/components/QuizApp/AdminPanel/SubscribersList";

export default function page({ params }: { params: string }) {
  return (
    <LeftSideBar>
      <SubscribersList quizId={params.id} />
    </LeftSideBar>
  );
}
