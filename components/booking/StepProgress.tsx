"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
    <div className="w-full flex justify-center items-center py-6 px-2 sm:px-4">
      <div className="flex items-center w-full max-w-2xl relative">
        
        {/* Background line container */}
        <div className="absolute top-4 sm:top-5 left-[16.66%] right-[16.66%] h-[2px] bg-gray-200 z-0">
          {/* Active progress line */}
          <div 
            className="h-full bg-[#0265AF] transition-all duration-500 ease-in-out" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative z-10 flex w-full">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isUpcoming = step.id > currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center relative group w-1/3">
                <div 
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 border-[2px] sm:border-[3px] bg-white z-10",
                    isCompleted ? "bg-[#0265AF] border-[#0265AF] text-white" : "",
                    isActive ? "border-[#0265AF] text-[#0265AF] shadow-[0_0_0_4px_rgba(2,101,175,0.1)] scale-110" : "",
                    isUpcoming ? "border-gray-200 text-gray-400" : ""
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold">{step.id}</span>
                  )}
                </div>
                <span 
                  className={cn(
                    "mt-2 sm:mt-3 text-[10px] sm:text-xs font-bold transition-all duration-300 text-center leading-tight sm:whitespace-nowrap px-1",
                    isActive ? "text-[#0265AF]" : isCompleted ? "text-[#0c243c]" : "text-gray-400"
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

