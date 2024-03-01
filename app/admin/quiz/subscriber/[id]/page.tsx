import LeftSideBar from "@/components/Layout/LeftSidebar";
import Subscribers from "@/components/QuizApp/AdminPanel/Subscribers";
import pathName from "@/constants";

export default function page({ params }: { params: string }) {
  return (
    <LeftSideBar>
      <Subscribers
        url={`${pathName.subscriptionApiRoute.path}/${params.id}`}
        // quizId={params.id}
        heading={`Subscribers`}
        placeholder="search candidate with name"
      />
    </LeftSideBar>
  );
}
