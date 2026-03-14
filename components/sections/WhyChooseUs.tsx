"use client";

import React from "react";
import Image from "next/image";
import { FileText, Lightbulb, Users, Clock } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WhyChooseUsCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-[#F9FAFB] p-8 border border-[#E5E9EB] hover:border-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
    <div className="size-10 bg-white shadow-xs border border-gray-100 flex items-center justify-center mb-6  transition-colors duration-300">
      <div className="group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-[#0c243c] mb-3 group-hover:text-blue-600 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-[#5a6b7d] text-[0.85rem] leading-relaxed">
      {description}
    </p>
  </div>
);

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Header */}
        <SectionHeader
          badge="Why Choose us"
          title="The Smarter Choice for Waste Management"
          maxWidth="max-w-3xl"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Image */}
          <div className="lg:col-span-4 relative min-h-[400px]">
            <Image
              src="/dummy.png"
              alt="Why Choose Us"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <WhyChooseUsCard
              icon={<FileText className="size-5 text-gray-600" />}
              title="Built for Simplicity"
              description="As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress."
            />
            <WhyChooseUsCard
              icon={<Lightbulb className="size-5 text-gray-600" />}
              title="Solutions That Scale With You"
              description="Whether you're a homeowner handling a weekend cleanup or a growing business managing multiple sites"
            />
            <WhyChooseUsCard
              icon={<Users className="size-5 text-gray-600" />}
              title="Long-Term Partnerships"
              description="We don't just aim to complete a single job—we aim to build lasting relationships. By understanding"
            />
            <WhyChooseUsCard
              icon={<Clock className="size-5 text-gray-600" />}
              title="Consistent Quality, Every Time"
              description="We maintain strict service standards to ensure the same level of quality on every delivery and pickup"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
