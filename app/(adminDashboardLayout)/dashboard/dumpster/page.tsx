"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DumpsterCard from "@/components/dashboard/dumpster/DumpsterCard";
import { cn } from "@/lib/utils";

interface Dumpster {
  id: string;
  image: string;
  title: string;
  price: number;
  category: "commercial" | "roll-off";
  capacity?: string;
  additionalInfo?: string[];
  deliveryNote?: string;
}

const dummyDumpsters: Dumpster[] = [
  // Commercial
  { id: "cm-1", image: "/blog/hero_bg.png", title: "2 Yard Dumpster", price: 80, category: "commercial" },
  { id: "cm-2", image: "/blog/hero_bg.png", title: "4 Yard Dumpster", price: 80, category: "commercial" },
  { id: "cm-3", image: "/blog/hero_bg.png", title: "6 Yard Dumpster", price: 80, category: "commercial" },
  { id: "cm-4", image: "/blog/hero_bg.png", title: "8 Yard Dumpster", price: 110, category: "commercial" },
  { id: "cm-5", image: "/blog/hero_bg.png", title: "10 Yard Dumpster", price: 110, category: "commercial" },
  // Roll off
  { 
    id: "ro-1", image: "/blog/hero_bg.png", title: "10 Yard Dumpster", price: 450, category: "roll-off", capacity: "1 Ton", 
    additionalInfo: ["-60 large trash bags, or", "-4 pickup truck loads"],
    deliveryNote: "Delivery and rental fees may apply."
  },
  { 
    id: "ro-2", image: "/blog/hero_bg.png", title: "15 Yard Dumpster", price: 550, category: "roll-off", capacity: "1.5 Ton", 
    additionalInfo: ["-90 large trash bags, or", "-6 pickup truck loads"],
    deliveryNote: "Delivery and rental fees may apply."
  },
  { 
    id: "ro-3", image: "/blog/hero_bg.png", title: "20 Yard Dumpster", price: 650, category: "roll-off", capacity: "2 Ton", 
    additionalInfo: ["-120 large trash bags, or", "-8 pickup truck loads"],
    deliveryNote: "Delivery and rental fees may apply."
  },
  { 
    id: "ro-4", image: "/blog/hero_bg.png", title: "30 Yard Dumpster", price: 850, category: "roll-off", capacity: "3 Ton", 
    additionalInfo: ["-180 large trash bags, or", "-14 pickup truck loads"],
    deliveryNote: "Delivery and rental fees may apply."
  },
];

const DumpsterPage = () => {
  const [activeTab, setActiveTab] = useState<"commercial" | "roll-off">("commercial");

  const filteredDumpsters = dummyDumpsters.filter(d => d.category === activeTab);

  return (
    <Container className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0A2540]">Dumpster</h1>
        <Link href="/dashboard/dumpster/add">
          <Button className="h-10 px-6 flex items-center gap-2 bg-[#0062AA] text-white hover:bg-[#004e89] transition-colors rounded-none">
            <Plus className="size-4" />
            Add New Dumpster
          </Button>
        </Link>
      </div>

      {/* Filters (Search & Tabs) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 items-center">
        {/* Search */}
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full h-12 pl-12 pr-4 bg-[#F4F7F9] border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0062AA] font-medium text-[#1A1A1A] placeholder:text-gray-400" 
          />
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center gap-1 bg-[#F4F7F9] p-1 rounded-none border border-gray-100">
          <button
            onClick={() => setActiveTab("commercial")}
            className={cn(
              "px-5 py-2.5 text-sm font-bold transition-all",
              activeTab === "commercial" 
                ? "bg-[#0062AA] text-white shadow-sm" 
                : "text-[#64748B] hover:text-[#0A2540]"
            )}
          >
            Commercial Service
          </button>
          <button
            onClick={() => setActiveTab("roll-off")}
            className={cn(
              "px-5 py-2.5 text-sm font-bold transition-all",
              activeTab === "roll-off" 
                ? "bg-[#0062AA] text-white shadow-sm" 
                : "text-[#64748B] hover:text-[#0A2540]"
            )}
          >
            Roll off Service
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
        {filteredDumpsters.map((dumpster) => (
          <DumpsterCard key={dumpster.id} {...dumpster} id={dumpster.id} />
        ))}
      </div>
    </Container>
  );
};

export default DumpsterPage;