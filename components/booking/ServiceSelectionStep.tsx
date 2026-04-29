"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Wrench, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { setServiceType, setDumpsterSize } from "@/feature/user/bookingSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetServiceAreaByIdQuery } from "@/redux/api/service-area/serviceAreaApi";

interface ServiceSelectionStepProps {
  onNext: () => void;
}

const serviceTypeMapping = {
  ROLL_OFF: {
    id: "roll-off",
    title: "Roll off Dumpster Service",
    icon: Wrench,
  },
  COMMERCIAL: {
    id: "commercial",
    title: "Commercial Service",
    icon: Building2,
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
    
    // When switching type, clear dumpster size or pick first available of that type
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
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-[#0265AF] animate-spin mb-4" />
        <p className="text-gray-500">Loading service options...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Service Area Info */}
      <div className="bg-white p-6 border-b border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-full">
            <Wrench className="w-5 h-5 text-[#0265AF]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0c243c]">
              {areaResponse?.data?.name || "Service Area"}
            </h2>
            <p className="text-sm text-gray-500">
              {areaResponse?.data?.address}
            </p>
          </div>
        </div>
      </div>

      {/* Service Type Selection */}
      <div className="bg-white p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-[#0c243c] mb-6">
          Select Your Service
        </h3>
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
                  "relative flex items-center gap-4 p-6 border-2 transition-all cursor-pointer",
                  isSelected
                    ? "border-[#0265AF] bg-white"
                    : "border-gray-100 hover:border-gray-200",
                )}
              >
                <div className="bg-gray-50 p-3">
                  <Icon className="w-6 h-6 text-[#0c243c]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0c243c]">{mapping.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-[250px]">
                    Robust disposal for renovations and job sites.
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[#0265AF]">
                    <CheckCircle2 className="w-5 h-5 fill-current text-white bg-[#0265AF] rounded-full" />
                  </div>
                )}
                {!isSelected && (
                  <div className="absolute top-4 right-4 w-5 h-5 border-2 border-gray-200 rounded-sm" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dumpster Size Selection */}
      {serviceType && (
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-6">
            Select Dumpster Size
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans
              .filter(p => (serviceType === "roll-off" ? p.plan.category === "ROLL_OFF" : p.plan.category === "COMMERCIAL"))
              .map((areaPlan) => {
                const plan = areaPlan.plan;
                const isSelected = dumpsterSize === areaPlan.id;
                return (
                  <div
                    key={areaPlan.id}
                    onClick={() => handleDumpsterSelect(areaPlan.id)}
                    className={cn(
                      "relative flex gap-6 p-6 border-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-[#0265AF]"
                        : "border-gray-100 hover:border-gray-200",
                    )}
                  >
                    <div className="w-32 h-24 relative flex-shrink-0 bg-gray-50 overflow-hidden">
                      <Image
                        src="/dummy.png"
                        alt={plan.dumpsterSize}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-[#0c243c]">{plan.dumpsterSize} Dumpster</h4>
                      <p className="text-sm mt-1">
                        <span className="text-gray-500">Price : </span>
                        <span className="text-[#0265AF] font-bold">
                          Starting at $450
                        </span>
                      </p>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs text-gray-500">
                          {plan.extraInfo}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">Delivery and rental fees may apply.</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-[#0265AF]">
                        <CheckCircle2 className="w-5 h-5 fill-current text-white bg-[#0265AF] rounded-full" />
                      </div>
                    )}
                    {!isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 border-2 border-gray-200 rounded-sm" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Footer Banner */}
      {serviceType && dumpsterSize && (
        <div className="bg-[#EBF6FF] p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-bold text-[#0c243c]">
              Selected : {serviceType === "roll-off" ? "Roll off Dumpster" : "Commercial Service"}{" "}
              - {plans.find(p => p.id === dumpsterSize)?.plan.dumpsterSize}
            </h4>
            <p className="text-sm text-gray-600">
              Discover our top-notch services
            </p>
          </div>
          <Button
            onClick={onNext}
            className="bg-[#0265AF] hover:bg-[#004d85] text-white px-8 py-6 rounded-none font-bold"
          >
            {user ? "Continue your booking" : "Log in to continue your booking"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelectionStep;
