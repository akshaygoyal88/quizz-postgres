import { CallToAction } from "@/components/CallToAction";
import { Faqs } from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { PrimaryFeatures } from "@/components/PrimaryFeatures";
import QuizSets from "@/components/QuizApp/UI/QuizList";
import { SecondaryFeatures } from "@/components/SecondaryFeatures";
import { Testimonials } from "@/components/Testimonials";
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
  return (
    <>
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
