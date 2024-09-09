import { CallToAction } from "@/components/CallToAction";
import { Faqs } from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { PrimaryFeatures } from "@/components/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/SecondaryFeatures";
import { Testimonials } from "@/components/Testimonials";
import { getSessionUser } from "@/utils/getSessionUser";

// const profileCompleted = async () => {
//   const res = await fetch("/api/getProfileCompleted/");
//   const isProfileCompleted = await res.json();
//   return isProfileCompleted;
// };

export default async function Home() {
  const userData = await getSessionUser();
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
