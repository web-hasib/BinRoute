"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Ruler, Weight, ArrowRight, ShieldCheck, SlidersHorizontal, Box, Layers } from "lucide-react";
import { DumpTruckIcon } from "@/components/icons/DumpTruckIcon";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDispatch } from "react-redux";
import { setServiceType } from "@/feature/user/bookingSlice";
import { motion, AnimatePresence } from "framer-motion";

interface DumpsterOption {
  size: string;
  name: string;
  tagline: string;
  dimensions: string;
  truckLoads: string;
  truckCount: number;
  weightLimit: string;
  idealFor: string[];
  popular?: boolean;
}

const dumpsterSizes: DumpsterOption[] = [
  {
    size: "10 Yard",
    name: "10-Yard Roll-Off",
    tagline: "Small Cleanouts & Minor Renovations",
    dimensions: '12\' L x 8\' W x 3.5\' H',
    truckLoads: "Approx. 3–4 pickup truck loads",
    truckCount: 4,
    weightLimit: "Up to 2 tons included",
    idealFor: [
      "Garage, attic, or basement decluttering",
      "Single-room carpet or flooring removal",
      "Small bathroom remodel debris",
      "Yard waste and seasonal landscape cleanups",
    ],
  },
  {
    size: "15 Yard",
    name: "15-Yard Roll-Off",
    tagline: "Most Popular for Remodels & Roofing",
    dimensions: '14\' L x 8\' W x 4.5\' H',
    truckLoads: "Approx. 5–6 pickup truck loads",
    truckCount: 6,
    weightLimit: "Up to 2.5 tons included",
    popular: true,
    idealFor: [
      "Multi-room decluttering & estate cleanups",
      "Full kitchen renovation tear-out",
      "Deck demolition up to 300 sq ft",
      "Roofing replacement up to 25–30 squares",
    ],
  },
  {
    size: "20 Yard",
    name: "20-Yard Roll-Off",
    tagline: "General Contractor Work & Whole-Home Demo",
    dimensions: '22\' L x 8\' W x 4\' H',
    truckLoads: "Approx. 7–8 pickup truck loads",
    truckCount: 8,
    weightLimit: "Up to 3 tons included",
    idealFor: [
      "Whole-home cleanouts & moving prep",
      "Large kitchen & master bath remodels",
      "Large deck removals & siding projects",
      "Commercial office cleanouts & updates",
    ],
  },
  {
    size: "30 Yard",
    name: "30-Yard Roll-Off",
    tagline: "Major Construction & Full Demolition",
    dimensions: '22\' L x 8\' W x 6\' H',
    truckLoads: "Approx. 11–12 pickup truck loads",
    truckCount: 12,
    weightLimit: "Up to 4 tons included",
    idealFor: [
      "Full residential home gutting & additions",
      "Commercial construction & warehouse cleanouts",
      "Large-scale storm damage restoration",
      "Complete roof tear-offs with multiple layers",
    ],
  },
];

const projectPresets = [
  { label: "Garage / Attic Cleanout", truckLoads: 3, targetSizeIndex: 0 },
  { label: "Kitchen / Bath Remodel", truckLoads: 5, targetSizeIndex: 1 },
  { label: "Deck / Roofing Tear-off", truckLoads: 8, targetSizeIndex: 2 },
  { label: "Whole-Home Demo", truckLoads: 12, targetSizeIndex: 3 },
];

const DumpsterEstimator = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [truckLoadSlider, setTruckLoadSlider] = useState(6);
  const dispatch = useDispatch();
  const active = dumpsterSizes[selectedIndex];

  const handleBook = () => {
    dispatch(setServiceType("roll-off"));
  };

  const handlePresetClick = (preset: typeof projectPresets[0]) => {
    setTruckLoadSlider(preset.truckLoads);
    setSelectedIndex(preset.targetSizeIndex);
  };

  const handleSliderChange = (val: number) => {
    setTruckLoadSlider(val);
    if (val <= 4) setSelectedIndex(0);
    else if (val <= 6) setSelectedIndex(1);
    else if (val <= 8) setSelectedIndex(2);
    else setSelectedIndex(3);
  };

  return (
    <section className="py-20 md:py-24 bg-[#F8FAFC] border-y border-slate-200 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            badge="Interactive Sizing Guide"
            title="Dumpster Sizes & Specifications"
            subtitle="Compare standard container dimensions, weight limits, or drag the interactive volume estimator to find your ideal fit."
          />
        </motion.div>

        {/* Interactive Draggable Volume Calculator Card */}
        <motion.div 
          className="mb-8 p-5 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xs"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0060AF] uppercase mb-1">
                <SlidersHorizontal className="size-3.5" />
                <span>Interactive Capacity Estimator</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Estimate by Pickup Truck Loads or Project Type
              </h4>
            </div>

            {/* Clickable Quick Project Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold mr-1">Quick Select:</span>
              {projectPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(preset)}
                  type="button"
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedIndex === preset.targetSizeIndex
                      ? "bg-blue-50 text-[#0060AF] border-[#0060AF]/40 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Draggable Slider Track & Capacity Meter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            <div className="md:col-span-8 space-y-4">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-bold text-slate-700">Debris Volume:</span>
                <span className="font-black text-[#0060AF] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                  {truckLoadSlider} Pickup Truck Loads (~{truckLoadSlider * 2.5} cubic yards)
                </span>
              </div>

              {/* Interactive Range Slider with Custom Truck Icon Thumb */}
              <div className="relative pt-2 pb-2">
                <div className="relative h-10 flex items-center">
                  {/* Track Bar Background */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full relative overflow-hidden">
                    {/* Active Track Progress Fill */}
                    <div
                      className="h-full bg-linear-to-r from-[#0060AF] to-[#0284C7] rounded-full transition-all duration-150"
                      style={{ width: `${((truckLoadSlider - 1) / 11) * 100}%` }}
                    />
                  </div>

                  {/* Custom Dump Truck Thumb Icon */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-9 sm:size-10 rounded-full bg-linear-to-r from-[#0060AF] to-[#0284C7] text-white shadow-md shadow-blue-900/30 border-2 border-white flex items-center justify-center pointer-events-none z-10"
                    style={{ left: `${((truckLoadSlider - 1) / 11) * 100}%` }}
                  >
                    <DumpTruckIcon className="size-5.5 text-white" />
                  </motion.div>

                  {/* Invisible Interactive Range Input */}
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={truckLoadSlider}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20"
                    aria-label="Debris Volume in Truck Loads"
                  />
                </div>

                {/* Milestone Step Labels */}
                <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1 px-1">
                  <span>1 Load (Small)</span>
                  <span>4 Loads (10 Yd)</span>
                  <span>6 Loads (15 Yd)</span>
                  <span>8 Loads (20 Yd)</span>
                  <span>12 Loads (30 Yd)</span>
                </div>
              </div>

              {/* Live Truck Icons Visualization */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: idx < truckLoadSlider ? 1.05 : 0.9,
                      opacity: idx < truckLoadSlider ? 1 : 0.25,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`size-7 rounded-md flex items-center justify-center text-xs ${
                      idx < truckLoadSlider
                        ? "bg-[#0060AF] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-400"
                    }`}
                    title={`Truck Load ${idx + 1}`}
                  >
                    <DumpTruckIcon className="size-3.5" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended Size Output Badge */}
            <div className="md:col-span-4 bg-linear-to-br from-[#0060AF] via-[#0055A0] to-[#00488A] text-white p-4.5 rounded-xl border border-blue-600/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wide">
                  Calculated Recommendation
                </span>
                <h4 className="text-xl font-black text-white mt-0.5">
                  {active.size} Container
                </h4>
                <p className="text-xs text-blue-50 mt-1 leading-relaxed">
                  Holds up to {active.truckLoads.replace("Approx. ", "")} with {active.weightLimit.toLowerCase()}.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="text-blue-100">Status:</span>
                <span className="font-bold text-sky-200 flex items-center gap-1">
                  <Check className="size-3" /> Ready to Book
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Size Selection Tabs - Full Width Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 w-full"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {dumpsterSizes.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={item.size}
                onClick={() => {
                  setSelectedIndex(idx);
                  setTruckLoadSlider(item.truckCount);
                }}
                type="button"
                className={`py-3.5 px-4 text-xs sm:text-sm font-bold transition-all duration-200 rounded-xl border cursor-pointer flex items-center justify-center gap-2 relative ${
                  isSelected
                    ? "bg-[#0060AF] text-white border-[#004D8C] shadow-md shadow-blue-900/15 ring-2 ring-[#0060AF]/20"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{item.size}</span>
                {item.popular && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    Popular
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Selected Dumpster Detail Card - Full Width Matching Grid */}
        <motion.div 
          className="w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-8 md:p-10 shadow-xs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.size}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Info Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mb-2">
                    {active.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {active.name}
                  </h3>
                </div>

                {/* Quick Specs Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Ruler className="size-4 text-[#0060AF]" />
                      <span>Dimensions</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {active.dimensions}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <DumpTruckIcon className="size-4 text-[#0060AF]" />
                      <span>Volume</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {active.truckLoads.split("Approx. ")[1] || active.truckLoads}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Weight className="size-4 text-[#0060AF]" />
                      <span>Weight Cap</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {active.weightLimit}
                    </p>
                  </div>
                </div>

                {/* Ideal Project Applications */}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">
                    Typical Project Uses:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {active.idealFor.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <div className="size-4.5 rounded-full bg-blue-50 text-[#0060AF] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="size-3" />
                        </div>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link href="/services/service-areas" onClick={handleBook}>
                    <Button variant="primary" size="lg" className="px-6 text-xs sm:text-sm font-bold rounded-md shadow-sm">
                      <span>Reserve {active.size} Container</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <Link href="/contact" className="text-xs sm:text-sm text-slate-600 hover:text-[#0060AF] underline font-semibold">
                    Need custom rental duration?
                  </Link>
                </div>
              </div>

              {/* Right Visual Graphic Column - Brand Blue Theme */}
              <div className="lg:col-span-5 bg-linear-to-br from-[#0060AF] via-[#0055A0] to-[#00488A] text-white p-7 rounded-xl border border-blue-600/30 shadow-md flex flex-col justify-between min-h-[320px]">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 text-white text-xs font-bold border border-white/20">
                    <Layers className="size-3.5 text-sky-200" />
                    <span>Loading Capacity</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {active.truckLoads}
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-50 leading-relaxed">
                    Driveway-friendly roll-off delivery. Wood blocking placed under wheels/rollers to protect residential asphalt and pavers.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/20 space-y-2.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-blue-100">Included Rental Period:</span>
                    <span className="font-bold text-white">7 Days Included</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-blue-100">Dispatch Hub:</span>
                    <span className="font-bold text-white">Worcester, MA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-blue-100">Driveway Protection:</span>
                    <span className="font-bold text-sky-200">Included Free</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default DumpsterEstimator;
