
import FAQAccordion from "@/components/sections/FAQAccordion";
import ReuseableHeroWithoutImage from "@/components/sections/ReuseableHeroWithoutImage";

export default function FAQPage() {
  return (
    <main>
      <ReuseableHeroWithoutImage title="Dumpster rental questions" description="Here are the questions we hear most from homeowners, contractors, and
                    local businesses in Worcester. If you do not see your question here,
                    you can call or email us anytime and we will help you." />
      <FAQAccordion />
    </main>
  );
}