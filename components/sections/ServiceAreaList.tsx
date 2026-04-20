"use client";

import React, { useState } from "react";
import { MapPin, ArrowRight, ArrowDown, Search, Building2, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetServiceAreasQuery } from "@/redux/api/service-area/serviceAreaApi";
import { Skeleton } from "@/components/ui/skeleton";

const servicesMapping = {
  COMMERCIAL: {
    label: "Commercial Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Building2,
  },
  ROLL_OFF: {
    label: "Roll off Dumpster Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Wrench,
  },
};

const ServiceAreaSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-100 px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="h-5 w-5 rounded-full shrink-0" />
          <Skeleton className="h-4 w-[40%] rounded-md" />
        </div>
        <Skeleton className="h-4 w-4 rounded-md shrink-0" />
      </div>
    ))}
  </div>
);

const ServiceAreaList = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: areasData, isLoading } = useGetServiceAreasQuery({
    isActive: true,
    searchTerm: search,
  });

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleServiceSelect = (locationId: string, serviceId: string) => {
    setSelectedService((prev) => ({ ...prev, [locationId]: serviceId }));
  };

  const handleContinue = (locationId: string) => {
    const service = selectedService[locationId];
    if (!service) return;
    router.push(`/services/booking?dumstar=${service}`);
  };

  const areas = areasData?.data || [];

  return (
    <div className="min-h-screen bg-[#F6F6F6] font-sans">
      {/* Hero Search Banner */}
      <div
        className="w-full px-4 py-20"
        style={{
          background: "linear-gradient(135deg, #0f2942 0%, #1a4a7a 55%, #1e6ba8 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Please select your area below
          </h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter your address..."
                className="w-full pl-10 pr-4 py-3 text-sm text-gray-700 bg-white rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              className="px-6 py-3 text-white text-sm font-semibold rounded-md transition"
              style={{ background: "#2563eb" }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">
          All Service Area
        </h2>

        {isLoading ? (
          <ServiceAreaSkeleton />
        ) : (
          <div className="flex flex-col gap-3">
            {areas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-100 italic text-gray-400">
                No service areas found matching your search.
              </div>
            ) : (
              areas.map((loc) => {
                const isOpen = expandedId === loc.id;
                const selected = selectedService[loc.id];

                return (
                  <div
                    key={loc.id}
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden"
                    style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}
                  >
                    {/* Row header */}
                    <button
                      onClick={() => handleToggle(loc.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium text-left">
                          {loc.address}
                        </span>
                      </div>
                      {isOpen ? (
                        <ArrowDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {/* Collapsible service cards */}
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {loc.plans?.map((areaPlan) => {
                            const planInfo = areaPlan.plan;
                            const mapping = servicesMapping[planInfo.category as keyof typeof servicesMapping] || {
                              label: planInfo.category.replace("_", " "),
                              description: planInfo.extraInfo || "Disposal service",
                              icon: Building2,
                            };
                            
                            const Icon = mapping.icon;
                            const isSelected = selected === planInfo.id;

                            return (
                              <button
                                key={planInfo.id}
                                onClick={() => handleServiceSelect(loc.id, planInfo.id)}
                                className="flex items-start gap-4 p-4 rounded-lg border text-left transition-all"
                                style={{
                                  borderColor: isSelected ? "#2563eb" : "#e5e7eb",
                                  background: isSelected ? "#eff6ff" : "#fff",
                                }}
                              >
                                {/* Icon box */}
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ background: "#f1f5f9" }}
                                >
                                  <Icon className="h-5 w-5 text-gray-700" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 mb-1">
                                    {mapping.label}
                                  </p>
                                  <p className="text-xs text-gray-400 leading-relaxed">
                                    Size: {planInfo.dumpsterSize} - {mapping.description}
                                  </p>
                                </div>

                                {/* Checkbox */}
                                <div
                                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                                  style={{
                                    borderColor: isSelected ? "#2563eb" : "#d1d5db",
                                    background: isSelected ? "#2563eb" : "#fff",
                                  }}
                                >
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Continue button */}
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleContinue(loc.id)}
                            disabled={!selected}
                            className="px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              background: selected ? "#2563eb" : "#93c5fd",
                              boxShadow: selected ? "0 4px 12px 0 rgba(37,99,235,0.3)" : "none",
                            }}
                          >
                            Continue your booking
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceAreaList;