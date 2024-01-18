import QuizSets from "@/components/QuizApp/UI/QuizSets";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// const profileCompleted = async () => {
//   const res = await fetch("/api/getProfileCompleted/");
//   const isProfileCompleted = await res.json();
//   return isProfileCompleted;
// };

export default async function Home() {
  // const isProfileCompleted = await profileCompleted();
  // if (!isProfileCompleted) redirect("/profile");
  const session = await getServerSession();
  return <h1>Home</h1>;
}
