"use client";

import React, { useState } from "react";
import { Layers, ShieldCheck, Clock, ArrowRight, Check } from "lucide-react";
import { DumpTruckIcon } from "@/components/icons/DumpTruckIcon";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineStep {
  id: number;
  number: string;
  title: string;
  shortDesc: string;
  duration: string;
  icon: React.ElementType;
  details: string[];
  highlight: string;
}

const timelineSteps: TimelineStep[] = [
  {
    id: 1,
    number: "01",
    title: "Select Size & Schedule",
    shortDesc: "Pick 10–30 yard capacity and select your preferred drop-off date with all-inclusive flat pricing.",
    duration: "Instant Online Booking",
    icon: Layers,
    details: [
      "Transparent flat rate with weight included",
      "Guaranteed next-day delivery slots",
      "Residential & commercial container sizes",
    ],
    highlight: "Flat rate includes drop-off, pickup & tonnage allowance.",
  },
  {
    id: 2,
    number: "02",
    title: "Precision Placement",
    shortDesc: "Our licensed drivers carefully position the container with driveway-safe wood protection boards.",
    duration: "Morning & Afternoon Windows",
    icon: ShieldCheck,
    details: [
      "Protective wood blocking under wheels & rollers",
      "No driveway damage or asphalt scratches",
      "Precise positioning for easy garage or jobsite access",
    ],
    highlight: "Driveway surface protection provided free on every drop-off.",
  },
  {
    id: 3,
    number: "03",
    title: "Load at Your Pace",
    shortDesc: "Take up to 7 full days to load your debris. Low step-in rear swinging doors make heavy lifting easy.",
    duration: "7 Days Included (Flexible)",
    icon: Clock,
    details: [
      "Walk-in rear door for easy wheelbarrow loading",
      "Handles renovation, roofing, cleanout & brush debris",
      "Extend your rental period anytime with a quick call",
    ],
    highlight: "Need more time? Easy daily extensions available on request.",
  },
  {
    id: 4,
    number: "04",
    title: "Prompt Haul & Eco-Sorting",
    shortDesc: "Request a pickup whenever you're ready. We transport debris to state-certified transfer and recycling stations.",
    duration: "Same/Next-Day Pickup",
    icon: DumpTruckIcon,
    details: [
      "On-demand haul away with prompt dispatch",
      "Rapid swap-out service for ongoing job sites",
      "Environmentally responsible sorting & recycling",
    ],
    highlight: "Over 70% of recyclable construction & demo materials diverted from landfills.",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const current = timelineSteps.find((s) => s.id === activeStep) || timelineSteps[0];
  const CurrentIcon = current.icon;

  return (
    <section className="py-20 md:py-24 bg-[#F8FAFC] border-b border-slate-200 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            badge="Simple Logistics Process"
            title="From Order to Haul-Away in 4 Smooth Steps"
            subtitle="Our streamlined delivery process ensures zero surprises, protected driveways, and dependable timing."
          />
        </motion.div>

        {/* Advanced Curved SVG Path Timeline (Desktop & Tablet) */}
        <motion.div 
          className="hidden md:block relative mb-8 pt-4 pb-2"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Custom SVG Curved Path Track */}
          <div className="relative w-full h-16 sm:h-20 mb-3">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 60"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#092a6837" />
                  <stop offset="50%" stopColor="#0b70a282" />
                  <stop offset="100%" stopColor="#0e7fb06b" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Guideline Path (Exactly through 12.5%, 37.5%, 62.5%, 87.5%) */}
              <path
                d="M 125 30 Q 250 10, 375 30 T 625 30 T 875 30"
                stroke="#E2E8F0"
                strokeWidth="3.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Active Animated Gradient Fill Path */}
              <motion.path
                d="M 125 30 Q 250 10, 375 30 T 625 30 T 875 30"
                stroke="url(#pathGradient)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: (activeStep - 1) / (timelineSteps.length - 1) }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                filter="url(#glow)"
              />

              {/* 4 Interactive SVG Checkpoint Nodes - Mathematically centered with 4-col grid */}
              {[
                { step: 1, cx: 125, cy: 30 },
                { step: 2, cx: 375, cy: 30 },
                { step: 3, cx: 625, cy: 30 },
                { step: 4, cx: 875, cy: 30 },
              ].map((node) => {
                const isSelected = activeStep === node.step;
                const isPassed = activeStep >= node.step;

                return (
                  <g 
                    key={node.step} 
                    className="cursor-pointer group"
                    onClick={() => setActiveStep(node.step)}
                  >
                    {/* Outer Circle Ring */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? "11" : isPassed ? "9" : "8"}
                      fill={isPassed ? "#3569caca" : "#3a430781"}
                      stroke={isSelected ? "#384046ff" : isPassed ? "#5288f4b7" : "#ececee5d"}
                      strokeWidth={isSelected ? "3" : "2"}
                      className="transition-all duration-300"
                    />

                    {/* Inner Center Dot */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? "4" : "3"}
                      fill={isPassed ? "#FFFFFF" : "#ffffffff"}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Draggable & Animated Step Indicator - Perfectly tracks 12.5%, 37.5%, 62.5%, 87.5% */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-12 rounded-full bg-linear-to-r from-[#0060AF]/90 to-[#0284C7]/90 text-white shadow-lg shadow-blue-900/25 border-2 border-white flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-20"
                animate={{
                  left: `${12.5 + (activeStep - 1) * 25}%`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 30 && activeStep < 4) {
                    setActiveStep((prev) => Math.min(4, prev + 1));
                  } else if (info.offset.x < -30 && activeStep > 1) {
                    setActiveStep((prev) => Math.max(1, prev - 1));
                  }
                }}
                title="Drag or click steps"
              >
                <DumpTruckIcon className="size-9.5" />
              </motion.div>
            </div>
          </div>

          {/* 4 Interactive Step Milestones - Full Width Grid */}
          <div className="grid grid-cols-4 gap-4 relative z-10 w-full">
            {timelineSteps.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.id;
              const isPast = activeStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  type="button"
                  className={`text-left p-5 rounded-xl border transition-all duration-200 group cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#0060AF] shadow-md shadow-blue-900/10 ring-2 ring-[#0060AF]/20 translate-y-[-2px]"
                      : "bg-white/90 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`size-11 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? "bg-[#0060AF] text-white shadow-sm"
                          : isPast
                          ? "bg-blue-50 text-[#0060AF] border border-blue-200"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="size-5.5" />
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-[#0060AF] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      Step {step.number}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold mb-1.5 transition-colors ${
                      isSelected ? "text-[#0060AF]" : "text-slate-900"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {step.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile / Tablet Timeline Steps */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {timelineSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                type="button"
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-white border-[#0060AF] shadow-sm ring-2 ring-[#0060AF]/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`size-9 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-[#0060AF] text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="size-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Step {step.number}
                  </span>
                </div>
                <h4
                  className={`text-xs sm:text-sm font-bold ${
                    isSelected ? "text-[#0060AF]" : "text-slate-900"
                  }`}
                >
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Deep-Dive Interactive Details Container - Full Width Matching Steps */}
        <motion.div 
          className="w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-8 md:p-10 shadow-xs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0060AF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    Step {current.number} Details
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {current.duration}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                    {current.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                    {current.shortDesc}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-1">
                  {current.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="size-5 rounded-full bg-blue-50 text-[#0060AF] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-3.5" />
                      </div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link href="/services/service-areas">
                    <Button variant="primary" size="lg" className="px-6 text-xs sm:text-sm font-bold rounded-md shadow-sm">
                      <span>Order Dumpster Online</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <a
                    href="tel:7746221884"
                    className="text-xs sm:text-sm text-slate-600 hover:text-[#0060AF] font-bold underline"
                  >
                    Or Call Dispatch: (774) 622-1884
                  </a>
                </div>
              </div>

              {/* Right Graphic Card - Brand Sapphire Theme */}
              <div className="lg:col-span-5 bg-linear-to-br from-[#0060AF]/75 via-[#0055A0]/75 to-[#00488A]/75 text-white p-7 rounded-xl border border-blue-600/30 shadow-md flex flex-col justify-between min-h-[300px]">
                <div className="space-y-3.5">
                  <div className="size-11 rounded-lg bg-white/15 flex items-center justify-center text-sky-200 border border-white/20">
                    <CurrentIcon className="size-5.5" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    Labonte Service Guarantee
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-50 leading-relaxed">
                    {current.highlight}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm text-blue-100">
                  <span>Coverage:</span>
                  <span className="font-bold text-white">Worcester County & Central MA</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
