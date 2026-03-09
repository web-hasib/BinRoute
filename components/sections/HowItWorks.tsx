"use client";

import React from "react";
import { Settings, Truck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Step = ({ icon, title, description }: StepProps) => (
  <div className="flex flex-col items-center text-center max-w-[280px]">
    <div className="size-20 bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6 relative">
      {icon}
      {/* Small dot on the right side of the box */}
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 size-2 bg-gray-900 rounded-full z-10 hidden md:block" />
    </div>
    <h3 className="text-xl font-bold text-[#0c243c] mb-3">{title}</h3>
    <p className="text-[#5a6b7d] text-sm leading-relaxed">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="container">
        {/* Header */}
        <SectionHeader
          badge="How it works"
          title="Your Waste Solution in 3 Simple Steps"
          maxWidth="max-w-2xl"
        />

        <div className="relative flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-12 md:gap-0">
          {/* Dotted Connecting Lines (Desktop only) */}
          <div className="absolute top-10 left-[15%] right-[15%] h-px border-t-2 border-dotted border-gray-300 z-0 hidden md:block" />

          {/* Steps */}
          <Step
            icon={<Settings className="size-10 text-[#F59E0B]" />}
            title="Choose Your Service"
            description="Clear information and transparent pricing help you make the right decision with confidence."
          />
          <Step
            icon={
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold text-red-500 uppercase leading-none">
                  Jul
                </div>
                <div className="text-2xl font-black text-gray-800 leading-none">
                  17
                </div>
              </div>
            }
            title="Schedule Delivery"
            description="Our team will deliver the container safely to your location and place it carefully for easy access."
          />
          <Step
            icon={<Truck className="size-10 text-[#10B981]" />}
            title="Fill It & Request Pickup"
            description="We'll arrive on time, remove the container, and handle the disposal responsibly"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
