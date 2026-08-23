"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, Truck, ClipboardList, CreditCard } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Select Service", icon: Truck },
  { id: 2, label: "Placement & Schedule", icon: ClipboardList },
  { id: 3, label: "Secure Payment", icon: CreditCard },
];

const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      <div className="flex items-center w-full max-w-2xl relative">
        {/* Background track line */}
        <div className="absolute top-5 sm:top-6 left-[16.66%] right-[16.66%] h-1 bg-slate-200 rounded-full z-0">
          {/* Active progress bar */}
          <div
            className="h-full bg-[#0060AF] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative z-10 flex w-full justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isUpcoming = step.id > currentStep;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center w-1/3 relative group">
                {/* Step Circle */}
                <div
                  className={cn(
                    "size-10 sm:size-12 rounded-xl flex items-center justify-center transition-all duration-300 font-bold z-10 shadow-xs",
                    isCompleted && "bg-[#0060AF] text-white border-2 border-[#0060AF] shadow-md shadow-blue-900/15",
                    isActive && "bg-white border-2 border-[#0060AF] text-[#0060AF] ring-4 ring-blue-500/15 scale-105",
                    isUpcoming && "bg-white border-2 border-slate-200 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2.5 text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Step {step.id}
                  </span>
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-bold transition-colors leading-tight",
                      isActive ? "text-[#0060AF]" : isCompleted ? "text-slate-800" : "text-slate-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
