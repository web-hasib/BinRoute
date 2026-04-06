"use client";

import React, { useState } from "react";
import { MapPin, ArrowRight, ArrowDown, Search, Building2, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

const locations = [
  { id: 1, address: "6391 Elgin St. Celina, Delaware 10299" },
  { id: 2, address: "2715 Ash Dr. San Jose, South Dakota 83475" },
  { id: 3, address: "2464 Royal Ln. Mesa, New Jersey 45463" },
  { id: 4, address: "4517 Washington Ave. Manchester, Kentucky 39495" },
  { id: 5, address: "6391 Elgin St. Celina, Delaware 10299" },
  { id: 6, address: "8502 Preston Rd. Inglewood, Maine 98380" },
  { id: 7, address: "2118 Thornridge Cir. Syracuse, Connecticut 35624" },
  { id: 8, address: "2118 Thornridge Cir. Syracuse, Connecticut 35624" },
  { id: 9, address: "2118 Thornridge Cir. Syracuse, Connecticut 35624" },
  { id: 10, address: "1901 Thornridge Cir. Shiloh, Hawaii 81063" },
];

const services = [
  {
    id: "commercial",
    label: "Commercial Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Building2,
  },
  {
    id: "roll-off",
    label: "Roll off Dumpster Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Wrench,
  },
];

const ServiceAreaList = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [selectedService, setSelectedService] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleServiceSelect = (locationId: number, serviceId: string) => {
    setSelectedService((prev) => ({ ...prev, [locationId]: serviceId }));
  };

  const handleContinue = (locationId: number) => {
    const service = selectedService[locationId];
    if (!service) return;
    router.push(`/services/booking?dumstar=${service}`);
  };

  const filtered = locations.filter((loc) =>
    loc.address.toLowerCase().includes(search.toLowerCase())
  );

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

        <div className="flex flex-col gap-3">
          {filtered.map((loc) => {
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
                      {services.map((service) => {
                        const Icon = service.icon;
                        const isSelected = selected === service.id;

                        return (
                          <button
                            key={service.id}
                            onClick={() => handleServiceSelect(loc.id, service.id)}
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
                                {service.label}
                              </p>
                              <p className="text-xs text-gray-400 leading-relaxed">
                                {service.description}
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
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaList;