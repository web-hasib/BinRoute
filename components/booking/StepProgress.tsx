"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Service" },
  { id: 2, label: "Information" },
  { id: 3, label: "Payment method" },
];

const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex items-center w-full max-w-2xl relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 z-0" />
        
        {/* Active progress line */}
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-[#0265AF] -translate-y-1/2 z-0 transition-all duration-300" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative z-10 flex justify-between w-full">
          {steps.map((step) => {
            const isActive = step.id <= currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-6 h-6 rounded-full mt-6 flex items-center justify-center transition-colors duration-300",
                    isActive ? "bg-[#0265AF]" : "bg-gray-300"
                  )}
                >
                  {/* The image shows a small dot inside or just a filled circle. It looks like a simple dot. */}
                </div>
                <span 
                  className={cn(
                    "mt-2  text-sm font-medium transition-colors duration-300 whitespace-nowrap",
                    isActive ? "text-[#0265AF]" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
