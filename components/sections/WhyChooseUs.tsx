"use client";

import React from "react";
import Image from "next/image";
import { FileText, CalendarCheck, Users, Clock } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const WhyChooseUsCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => (
  <motion.div
    className="bg-[#F8FAFC] p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-200 group flex flex-col justify-between hover:shadow-sm"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
  >
    <div>
      <div className="size-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0060AF] group-hover:text-white group-hover:border-[#004D8C] transition-colors text-slate-700 shadow-2xs">
        <Icon className="size-4.5" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-[#0060AF] transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 text-xs leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

const metrics = [
  { value: "99.4%", label: "On-Time Dispatch Rate", sub: "Prompt morning & afternoon windows" },
  { value: "12,000+", label: "Dumpsters Delivered", sub: "Across Worcester County" },
  { value: "100%", label: "Driveway Protection", sub: "Surface boards on every drop-off" },
  { value: "5.0 ★", label: "Google Verified Rating", sub: "Over 150+ local reviews" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            badge="Why Bin Route "
            title="Direct Local Logistics. Zero Hidden Fees."
            subtitle="We combine local responsiveness, modern equipment, and honest flat rates to keep your cleanup running on schedule."
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          {/* Left Column: Image */}
          <motion.div
            className="lg:col-span-5 relative min-h-[340px] md:min-h-[420px] border border-slate-200 rounded-xl overflow-hidden shadow-xs"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src="/home-2.png"
              alt="Why Choose Bin Route "
              fill
              className="object-cover transition-transform duration-500 hover:scale-102"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[11px] font-bold text-sky-300 uppercase">Local Commitment</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 mt-0.5">
                Serving Worcester, Shrewsbury, Auburn, Millbury, Holden, and Central MA.
              </p>
            </div>
          </motion.div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <WhyChooseUsCard
              index={0}
              icon={FileText}
              title="All-Inclusive Flat Pricing"
              description="No surprise drop-off fees or fuel surcharges. Flat rate includes placement, pickup, and specified tonnage."
            />
            <WhyChooseUsCard
              index={1}
              icon={CalendarCheck}
              title="Flexible Rental Schedules"
              description="Whether you need a dumpster for 2 days or 2 weeks, we adapt pickup schedules to fit your project timeline."
            />
            <WhyChooseUsCard
              index={2}
              icon={Users}
              title="Direct Dispatch Support"
              description="Speak directly with local dispatchers who know Worcester County geography, parking, and permit rules."
            />
            <WhyChooseUsCard
              index={3}
              icon={Clock}
              title="Rapid Swaps & Haul-Aways"
              description="Full container? Request a prompt empty-and-return swap to keep your jobsite moving without downtime."
            />
          </div>
        </div>

        {/* Live Trust Metrics Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-8 border-t border-slate-200"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          {metrics.map((item, index) => (
            <div key={index} className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-colors shadow-2xs">
              <span className="block text-xl sm:text-2xl font-black text-[#0060AF] mb-0.5">
                {item.value}
              </span>
              <span className="block text-xs font-bold text-slate-900 mb-0.5">
                {item.label}
              </span>
              <span className="block text-[11px] text-slate-500">
                {item.sub}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
