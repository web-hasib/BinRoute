import Hero from "@/components/sections/Hero";
import DumpsterEstimator from "@/components/sections/DumpsterEstimator";
import ServiceOverview from "@/components/sections/ServiceOverview";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import LatestArticles from "@/components/sections/LatestArticles";

export default function Home() {
  return (
    <main>
      <Hero />
      <DumpsterEstimator />
      <ServiceOverview />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <LatestArticles />
    </main>
  );
}
