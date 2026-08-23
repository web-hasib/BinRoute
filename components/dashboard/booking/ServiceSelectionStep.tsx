"use client";

import React, { useState } from "react";
import { Building2, Hammer, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ServiceSelectionStepProps {
  onNext: (selection: { service: string; size: string }) => void;
}

const serviceTypes = [
  {
    id: "commercial",
    title: "Commercial Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Building2,
  },
  {
    id: "roll-off",
    title: "Roll of Dumpster Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Hammer,
  },
];

const dumpsterSizes = [
  { id: "2-yard", title: "2 Yard Dumpster", price: 80, image: "/dummy.png" },
  { id: "4-yard", title: "4 Yard Dumpster", price: 80, image: "/dummy.png" },
  { id: "6-yard", title: "6 Yard Dumpster", price: 80, image: "/dummy.png" },
  { id: "8-yard", title: "8 Yard Dumpster", price: 110, image: "/dummy.png" },
  { id: "10-yard", title: "10 Yard Dumpster", price: 110, image: "/dummy.png" },
];

const ServiceSelectionStep = ({ onNext }: ServiceSelectionStepProps) => {
  const [selectedService, setSelectedService] = useState<string | null>("commercial");
  const [selectedSize, setSelectedSize] = useState<string | null>("2-yard");

  const currentSelection = {
    service: serviceTypes.find(s => s.id === selectedService),
    size: dumpsterSizes.find(d => d.id === selectedSize)
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Select Service Type */}
      <div className="bg-white p-6 border border-gray-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-xl font-bold text-[#0c243c] mb-6">Select Service Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceTypes.map((service) => {
            const isSelected = selectedService === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={cn(
                  "relative flex items-center gap-6 p-6 border-2 transition-all cursor-pointer rounded-none",
                  isSelected 
                    ? "border-[#0265AF] bg-white ring-1 ring-[#0265AF]" 
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className="bg-gray-50 p-4 border border-gray-100">
                  <service.icon className="w-8 h-8 text-[#0c243c]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-[#0c243c]">{service.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 leading-snug">{service.description}</p>
                </div>
                <div className={cn(
                  "w-5 h-5 border-2 rounded-sm transition-all flex items-center justify-center",
                  isSelected ? "bg-[#0265AF] border-[#0265AF]" : "border-gray-200"
                )}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white fill-current" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Select Dumpster Size */}
      <div className="bg-white p-6 border border-gray-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-xl font-bold text-[#0c243c] mb-6">Select Dumpster Size</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dumpsterSizes.map((size) => {
            const isSelected = selectedSize === size.id;
            return (
              <div
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={cn(
                  "relative flex items-center gap-6 p-6 border-2 transition-all cursor-pointer rounded-none",
                  isSelected 
                    ? "border-[#0265AF] ring-1 ring-[#0265AF]" 
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className="w-32 h-24 relative bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                  <Image src={size.image} alt={size.title} fill className="object-cover p-2" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-[#0c243c]">{size.title}</h4>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">Price : Starting at </span>
                    <span className="text-[#0265AF] font-bold">${size.price}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Delivery fees may apply</p>
                </div>
                <div className={cn(
                  "w-5 h-5 border-2 rounded-sm transition-all flex items-center justify-center",
                  isSelected ? "bg-[#0265AF] border-[#0265AF]" : "border-gray-200"
                )}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white fill-current" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Banner */}
      {selectedService && selectedSize && (
        <div className="bg-[#EBF6FF] p-6 border border-[#B3D6F2] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-[#0c243c]">
              Selected : {currentSelection.service?.title} - {currentSelection.size?.title}
            </h4>
            <p className="text-sm text-gray-600 font-medium tracking-tight">
              Discover our top-notch commercial services
            </p>
          </div>
          <Button
            onClick={() => onNext({ service: selectedService, size: selectedSize })}
            className="bg-[#0265AF] hover:bg-[#004d85] text-white px-10 py-7 text-lg rounded-none font-bold shadow-lg transition-all active:scale-95"
          >
            Continue with Booking
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelectionStep;
