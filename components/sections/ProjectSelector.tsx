"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Hammer,
  Building2,
  TreePine,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDispatch } from "react-redux";
import { setServiceType } from "@/feature/user/bookingSlice";

interface ProjectType {
  id: string;
  icon: React.ElementType;
  title: string;
  shortDesc: string;
  recommendedSize: string;
  includedTons: string;
  keyMaterials: string[];
  proTip: string;
  serviceType: "roll-off" | "commercial";
}

const projects: ProjectType[] = [
  {
    id: "residential-cleanout",
    icon: Home,
    title: "Home Declutter & Moving",
    shortDesc: "Attic, basement, garage cleanouts, or moving preparation.",
    recommendedSize: "10 or 15 Yard Roll-Off",
    includedTons: "2 to 2.5 Tons",
    keyMaterials: ["Old furniture & mattresses", "Boxed goods & clothing", "Carpeting & padding", "General household junk"],
    proTip: "Break down large furniture items before loading to maximize usable cubic yardage.",
    serviceType: "roll-off",
  },
  {
    id: "remodel-renovation",
    icon: Hammer,
    title: "Kitchen & Bath Remodel",
    shortDesc: "Cabinetry tear-outs, drywall demo, tile, and flooring replacements.",
    recommendedSize: "15 or 20 Yard Roll-Off",
    includedTons: "2.5 to 3 Tons",
    keyMaterials: ["Drywall, plaster & studs", "Countertops & sinks", "Subflooring & ceramic tiles", "Old appliances & vanities"],
    proTip: "Tile and plaster get heavy quickly. Keep heavy debris distributed evenly along the container floor.",
    serviceType: "roll-off",
  },
  {
    id: "roofing-landscaping",
    icon: TreePine,
    title: "Roofing, Deck & Yard",
    shortDesc: "Shingle tear-offs, deck demolition, trees, branches, and landscaping.",
    recommendedSize: "15 or 20 Yard Roll-Off",
    includedTons: "2.5 to 3 Tons",
    keyMaterials: ["Asphalt shingles & felt", "Treated deck lumber", "Tree branches & shrubs", "Fencing & siding pieces"],
    proTip: "For 1 layer of asphalt shingles on a standard roof (~25–30 squares), a 15-yard container is optimal.",
    serviceType: "roll-off",
  },
  {
    id: "commercial-business",
    icon: Building2,
    title: "Commercial & Business",
    shortDesc: "Ongoing commercial pickups, office renovations, or retail waste.",
    recommendedSize: "Commercial Scheduled Dumpster",
    includedTons: "Custom Volume Plan",
    keyMaterials: ["Retail packaging & cardboard", "Office cubicle cleanouts", "Regular enterprise waste", "Scheduled multi-site pickups"],
    proTip: "We offer tailored weekly, bi-weekly, or on-demand commercial container swaps.",
    serviceType: "commercial",
  },
];

const ProjectSelector = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("residential-cleanout");
  const dispatch = useDispatch();
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleBook = () => {
    dispatch(setServiceType(activeProject.serviceType));
  };

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Job Matching"
          title="Recommended Dumpsters by Project Type"
          subtitle="Choose your job type below to view the best container size, weight allowances, and debris handling tips."
        />

        {/* Project Category Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {projects.map((item) => {
            const isSelected = selectedProjectId === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedProjectId(item.id)}
                type="button"
                className={`p-4 text-left rounded-[2px] transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/50 border-[#0060AF] shadow-2xs ring-1 ring-[#0060AF]"
                    : "bg-[#f8fafc] border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`size-9 rounded-[2px] flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected
                      ? "bg-[#0060AF] text-white"
                      : "bg-white border border-slate-300 text-slate-700"
                  }`}
                >
                  <Icon className="size-4.5" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.shortDesc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Recommendation Detail Box */}
        <div className="bg-[#f8fafc] border border-slate-300 rounded-[2px] p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold text-slate-600">Recommended Size:</span>
                <span className="px-2.5 py-0.5 bg-[#0060AF] text-white text-xs font-bold rounded-[2px]">
                  {activeProject.recommendedSize}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-0.5 rounded-[2px] border border-slate-300">
                  Included Weight: {activeProject.includedTons}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  Accepted Materials:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeProject.keyMaterials.map((mat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-[2px] flex items-start gap-2.5 text-xs text-slate-700">
                <AlertCircle className="size-4 text-[#0060AF] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Loading Tip: </span>
                  <span>{activeProject.proTip}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-2">
              <Link href="/services/service-areas" onClick={handleBook} className="w-full sm:w-auto">
                <Button variant="primary" size="default" className="w-full sm:w-auto px-5 text-xs sm:text-sm font-bold">
                  <span>Select & Check Rates</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <span className="text-[11px] text-slate-500">
                Driveway protection boards included free
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSelector;
