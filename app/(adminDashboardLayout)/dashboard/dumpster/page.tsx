"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/ui/container";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DumpsterCard from "@/components/dashboard/dumpster/DumpsterCard";
import { DumpsterGridSkeleton } from "@/components/dashboard/dumpster/DumpsterSkeleton";
import { cn } from "@/lib/utils";
import { useGetServicePlansQuery } from "@/redux/api/dumpster-plan/dumpsterPlanApi";

const DumpsterPage = () => {
  const [activeTab, setActiveTab] = useState<"COMMERCIAL" | "ROLL_OFF">("COMMERCIAL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term to minimize API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch real data from the API
  const { data: plansData, isLoading } = useGetServicePlansQuery({
    category: activeTab, // Now matches the API enum exactly
    searchTerm: debouncedSearch,
  });

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
            placeholder="Search by size (e.g. 4 Yard)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-[#F4F7F9] border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0062AA] font-medium text-[#1A1A1A] placeholder:text-gray-400" 
          />
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center gap-1 bg-[#F4F7F9] p-1 rounded-none border border-gray-100">
          <button
            onClick={() => setActiveTab("COMMERCIAL")}
            className={cn(
              "px-5 py-2.5 text-sm font-bold transition-all",
              activeTab === "COMMERCIAL" 
                ? "bg-[#0062AA] text-white shadow-sm" 
                : "text-[#64748B] hover:text-[#0A2540]"
            )}
          >
            Commercial Service
          </button>
          <button
            onClick={() => setActiveTab("ROLL_OFF")}
            className={cn(
              "px-5 py-2.5 text-sm font-bold transition-all",
              activeTab === "ROLL_OFF" 
                ? "bg-[#0062AA] text-white shadow-sm" 
                : "text-[#64748B] hover:text-[#0A2540]"
            )}
          >
            Roll off Service
          </button>
        </div>
      </div>

      {/* Loading & Grid */}
      {isLoading ? (
        <DumpsterGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
          {plansData?.data?.map((plan) => (
            <DumpsterCard 
              key={plan.id} 
              id={plan.id}
              image={plan.image || "/blog/hero_bg.png"} 
              title={plan.dumpsterSize}
              price={plan.price}
              additionalInfo={plan.features}
              deliveryNote={plan.extraInfo}
            />
          ))}
          {plansData?.data?.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 border border-dashed border-gray-200">
              <p className="text-gray-500">No dumpsters found for this category or search.</p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default DumpsterPage;