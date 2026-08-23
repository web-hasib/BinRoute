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
    <div className="w-full flex justify-center items-center py-10 sm:py-12 bg-white/50 rounded-none border border-gray-100/30">
      <div className="flex items-center w-full max-w-2xl relative px-10">
        {/* Background line */}
        <div className="absolute top-[16px] left-[60px] right-[60px] h-[1.5px] bg-gray-200 z-0" />
        
        {/* Active progress line */}
        <div 
          className="absolute top-[16px] left-[60px] h-[1.5px] bg-[#0265AF] z-0 transition-all duration-500 ease-out" 
          style={{ width: `calc((( ${currentStep} - 1) / (${steps.length} - 1)) * (100% - 120px))` }}
        />

        <div className="relative z-10 flex justify-between w-full">
          {steps.map((step) => {
            const isActive = step.id <= currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center group">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                    isActive ? "bg-[#0265AF] shadow-lg shadow-blue-200/50 scale-110" : "bg-gray-300 scale-100"
                  )}
                >
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse opacity-80" />
                </div>
                <span 
                  className={cn(
                    "mt-4 text-sm font-bold transition-all duration-500 whitespace-nowrap tracking-tight uppercase tracking-wider",
                    isActive ? "text-[#0265AF] translate-y-0" : "text-gray-400 translate-y-1"
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
