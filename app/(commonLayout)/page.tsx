import Hero from "@/components/sections/Hero";
import ServiceOverview from "@/components/sections/ServiceOverview";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChooseUs from "@/components/sections/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiceOverview />
      <HowItWorks />
      <WhyChooseUs />
    </main>
  );
}
