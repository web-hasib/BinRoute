"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Building2, Check, Loader2, MapPin, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { DumpTruckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { setServiceType, setDumpsterSize } from "@/feature/user/bookingSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetServiceAreaByIdQuery } from "@/redux/api/service-area/serviceAreaApi";
import { motion } from "framer-motion";
import Link from "next/link";

interface ServiceSelectionStepProps {
  onNext: () => void;
}

const serviceTypeMapping = {
  ROLL_OFF: {
    id: "roll-off",
    title: "Roll-Off Dumpster Rental",
    subtitle: "Temporary driveway-safe containers for cleanouts, remodels, roofing, and construction.",
    badge: "Residential & Contractor",
    icon: DumpTruckIcon,
  },
  COMMERCIAL: {
    id: "commercial",
    title: "Commercial Waste Service",
    subtitle: "Scheduled recurring pickups and permanent container service for businesses.",
    badge: "Commercial Facilities",
    icon: Building2,
  },
};

const DUMPSTER_SPECS: Record<string, { dimensions: string; capacity: string; weightLimit: string }> = {
  "10 Yard": {
    dimensions: "12' L x 8' W x 3.5' H",
    capacity: "~4 Pickup Truck Loads",
    weightLimit: "2 Tons Included",
  },
  "15 Yard": {
    dimensions: "14' L x 8' W x 4.5' H",
    capacity: "~6 Pickup Truck Loads",
    weightLimit: "2.5 Tons Included",
  },
  "20 Yard": {
    dimensions: "22' L x 8' W x 4' H",
    capacity: "~8 Pickup Truck Loads",
    weightLimit: "3 Tons Included",
  },
  "30 Yard": {
    dimensions: "22' L x 8' W x 6' H",
    capacity: "~12 Pickup Truck Loads",
    weightLimit: "4 Tons Included",
  },
};

const ServiceSelectionStep = ({ onNext }: ServiceSelectionStepProps) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const areaId = searchParams.get("areaId");
  const dumstar = searchParams.get("dumstar");

  const { data: areaResponse, isLoading } = useGetServiceAreaByIdQuery(areaId || "", {
    skip: !areaId,
  });

  const { serviceType, dumpsterSize } = useSelector(
    (state: RootState) => state.booking,
  );
  const user = useSelector((state: RootState) => state.user.user);

  const plans = useMemo(() => areaResponse?.data?.plans || [], [areaResponse]);

  // Group plans by category for service type selection
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    plans.forEach((p) => categories.add(p.plan.category));
    return Array.from(categories);
  }, [plans]);

  // Sync URL params with Redux on initial load
  useEffect(() => {
    if (plans.length > 0 && dumstar) {
      const targetPlan = plans.find((p) => p.id === dumstar);
      if (targetPlan) {
        const category = targetPlan.plan.category;
        const mappedType = category === "ROLL_OFF" ? "roll-off" : "commercial";
        
        dispatch(setServiceType(mappedType as any));
        dispatch(setDumpsterSize({ 
          id: targetPlan.id, 
          price: 450 
        }));
      }
    }
  }, [plans, dumstar, dispatch]);

  const handleServiceTypeSelect = (type: "roll-off" | "commercial") => {
    dispatch(setServiceType(type));
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    
    // When switching type, pick first available of that type
    const firstPlanOfType = plans.find(p => 
      (type === "roll-off" && p.plan.category === "ROLL_OFF") || 
      (type === "commercial" && p.plan.category === "COMMERCIAL")
    );
    if (firstPlanOfType) {
      params.set("dumstar", firstPlanOfType.id);
      dispatch(setDumpsterSize({ id: firstPlanOfType.id, price: 450 }));
    }
    
    router.replace(`/services/booking?${params.toString()}`);
  };

  const handleDumpsterSelect = (id: string) => {
    dispatch(setDumpsterSize({ id, price: 450 }));
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("dumstar", id);
    if (serviceType) {
      params.set("type", serviceType);
    }
    router.replace(`/services/booking?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <Loader2 className="size-10 text-[#0060AF] animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading service options & container sizes...</p>
      </div>
    );
  }

  const selectedPlan = plans.find((p) => p.id === dumpsterSize);

  return (
    <div className="space-y-8">
      {/* Service Area Verified Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-xl bg-blue-50 text-[#0060AF] flex items-center justify-center border border-blue-100 shrink-0">
            <MapPin className="size-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {areaResponse?.data?.name || areaResponse?.data?.address || "Verified Delivery Zone"}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <Check className="size-3" /> In Delivery Network
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {areaResponse?.data?.address} {areaResponse?.data?.postalCodes?.length ? `• Zip Codes: ${areaResponse.data.postalCodes.join(", ")}` : ""}
            </p>
          </div>
        </div>

        <Link
          href="/services/service-areas"
          className="text-xs font-bold text-[#0060AF] hover:underline shrink-0"
        >
          Change Location
        </Link>
      </div>

      {/* Service Type Selection */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0060AF]">
            Step 1.1
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Select Your Disposal Category
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose whether you need a temporary roll-off container or scheduled commercial waste service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniqueCategories.map((category) => {
            const mapping = serviceTypeMapping[category as keyof typeof serviceTypeMapping];
            if (!mapping) return null;
            
            const isSelected = serviceType === mapping.id;
            const Icon = mapping.icon;

            return (
              <div
                key={mapping.id}
                onClick={() => handleServiceTypeSelect(mapping.id as any)}
                className={cn(
                  "relative flex items-start gap-4 p-5 sm:p-6 rounded-xl border-2 transition-all cursor-pointer",
                  isSelected
                    ? "border-[#0060AF] bg-blue-50/20 shadow-md shadow-blue-900/5 ring-2 ring-[#0060AF]/15"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                )}
              >
                <div className={cn(
                  "size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "bg-[#0060AF] text-white" : "bg-slate-100 text-slate-700"
                )}>
                  <Icon className="size-6" />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {mapping.title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {mapping.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {mapping.subtitle}
                  </p>
                </div>

                {/* Radio Indicator */}
                <div
                  className={cn(
                    "absolute top-5 right-5 size-5 rounded-full border flex items-center justify-center transition-all",
                    isSelected
                      ? "bg-[#0060AF] border-[#0060AF] text-white shadow-xs"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {isSelected && <Check className="size-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dumpster Size Selection */}
      {serviceType && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0060AF]">
                Step 1.2
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Select Your Container Capacity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard 7-day rental period with driveway protection included on all drop-offs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {plans
              .filter((p) => (serviceType === "roll-off" ? p.plan.category === "ROLL_OFF" : p.plan.category === "COMMERCIAL"))
              .map((areaPlan) => {
                const plan = areaPlan.plan;
                const isSelected = dumpsterSize === areaPlan.id;
                const specs = DUMPSTER_SPECS[plan.dumpsterSize] || {
                  dimensions: "Standard Dimensions",
                  capacity: "Generous Load Volume",
                  weightLimit: "Standard Weight Limit Included",
                };

                return (
                  <div
                    key={areaPlan.id}
                    onClick={() => handleDumpsterSelect(areaPlan.id)}
                    className={cn(
                      "relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-[#0060AF] bg-white shadow-lg shadow-blue-900/10 ring-2 ring-[#0060AF]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs"
                    )}
                  >
                    <div>
                      {/* Top Header inside Card */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-12 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors",
                            isSelected ? "bg-[#0060AF] text-white" : "bg-blue-50 text-[#0060AF] border border-blue-100"
                          )}>
                            <DumpTruckIcon className="size-6" />
                          </div>
                          <div>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                              {plan.dumpsterSize} Container
                            </h4>
                            <p className="text-xs font-bold text-[#0060AF] mt-0.5">
                              Starting at $450 <span className="text-[11px] font-normal text-slate-400">/ 7-Day Rental</span>
                            </p>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "size-5 rounded-full border flex items-center justify-center transition-all shrink-0 mt-1",
                            isSelected
                              ? "bg-[#0060AF] border-[#0060AF] text-white shadow-xs"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {isSelected && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Specs Badges */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">Dimensions:</span>
                          <span className="text-slate-800 font-bold">{specs.dimensions}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">Capacity:</span>
                          <span className="text-slate-800 font-bold">{specs.capacity}</span>
                        </div>
                      </div>

                      {/* Description & Included tonnage */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {plan.extraInfo || "Perfect for residential decluttering, renovation tear-outs, and construction debris."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-sky-700">
                        <ShieldCheck className="size-3.5" /> Wood boards under rollers
                      </span>
                      <span className="font-bold text-slate-700">{specs.weightLimit}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Floating Action Banner */}
      {serviceType && dumpsterSize && selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-800"
        >
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Selected Option:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                {serviceType === "roll-off" ? "Roll-Off Dumpster" : "Commercial Service"}
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              {selectedPlan.plan.dumpsterSize} Container
            </h4>
            <p className="text-xs text-slate-400">
              Ready to configure placement location, delivery date, and contact details.
            </p>
          </div>

          <Button
            onClick={onNext}
            variant="primary"
            size="lg"
            className="w-full md:w-auto h-12 px-8 text-xs sm:text-sm font-bold gap-2 rounded-xl shadow-md"
          >
            <span>{user ? "Continue to Step 2: Placement" : "Sign In & Continue Booking"}</span>
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceSelectionStep;
