"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CurrentScheduleInfo from "./CurrentScheduleInfo";
import { cn } from "@/lib/utils";

interface ChangeFrequencyFormValues {
  frequency: string;
  serviceDays: string[];
  reason: string;
}

interface ChangeFrequencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: ChangeFrequencyFormValues) => void;
}

const ChangeFrequencyModal = ({ isOpen, onClose, onSubmitSuccess }: ChangeFrequencyModalProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<ChangeFrequencyFormValues>({
    defaultValues: {
      frequency: "1x Per Month",
      serviceDays: ["Mon"],
      reason: "",
    }
  });

  const selectedFrequency = watch("frequency");
  const selectedDays = watch("serviceDays");

  const frequencies = [
    "1x Per Month", "1x Per Week", "2x Per Week",
    "3x Per Week", "4x Per Week", "5x Per Week"
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const onSubmit = (data: ChangeFrequencyFormValues) => {
    console.log("Change Frequency Form Data:", data);
    onSubmitSuccess(data);
  };

  const toggleDay = (day: string) => {
    const currentDays = [...selectedDays];
    if (currentDays.includes(day)) {
      setValue("serviceDays", currentDays.filter(d => d !== day));
    } else {
      setValue("serviceDays", [...currentDays, day]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Frequency Service Schedule"
      description="Manage and track your dumpster rental service operations."
      className="max-w-7xl" // Using standard tailwind class
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 py-4">
        {/* Main Content Area */}
        <div className="flex-2 space-y-8">
          <CurrentScheduleInfo />

          {/* Update Frequency */}
          <div className="bg-white border border-gray-100 p-8">
            <h3 className="text-sm font-bold text-[#172C41] mb-6">Update Frequency</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {frequencies.map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setValue("frequency", freq)}
                  className={cn(
                    "p-4 text-xs font-semibold border transition-all",
                    selectedFrequency === freq
                      ? "border-[#0061AA] text-[#0061AA] bg-white shadow-sm ring-1 ring-[#0061AA]"
                      : "border-gray-100 text-gray-400 bg-white hover:border-gray-200"
                  )}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Select New Service Days */}
          <div className="bg-white border border-gray-100 p-8">
            <h3 className="text-sm font-bold text-[#172C41] mb-6">Select New Service Days</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "p-4 text-xs font-semibold border transition-all",
                    selectedDays.includes(day)
                      ? "border-[#0061AA] text-[#0061AA] ring-1 ring-[#0061AA]"
                      : "border-gray-100 text-gray-400 bg-white hover:border-gray-200"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Change */}
          <div className="bg-white border border-gray-100 p-8">
            <h3 className="text-sm font-bold text-[#172C41] mb-6">Reason for Change (Optional)</h3>
            <textarea
              {...register("reason")}
              placeholder="Please provide any additional context for the administrator..."
              className="w-full p-6 bg-[#F8F9FA] border-none outline-none text-gray-800 placeholder:text-gray-400 min-h-[120px] resize-none text-sm"
            />
          </div>
        </div>

        {/* Request Summary Sidebar */}
        <div className="flex-1">
          <div className="bg-[#0c243c] h-full flex flex-col shadow-lg">
            <div className="p-8 border-b border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Request Summary</h3>
              <p className="text-gray-400 text-[10px] leading-relaxed">Check the status and history of your requests.</p>
            </div>
            
            <div className="p-8 flex-1 space-y-8 bg-white m-px">
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Service Days</span>
                  <span className="text-[#172C41] font-bold">{selectedDays.join(", ") || "None"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Dumpster Size</span>
                  <span className="text-[#172C41] font-bold">2 Yard Dumpster</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Service Frequency</span>
                  <span className="text-[#172C41] font-bold">{selectedFrequency}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-dashed border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-[#172C41]">Total amount</span>
                <span className="text-xl font-bold text-[#172C41]">$205.50</span>
              </div>

              {/* Approval Info Box */}
              <div className="bg-[#F4FAFF] border border-[#E6F4FF] p-4 flex gap-3">
                <div className="p-1 bg-[#0061AA] rounded-full h-fit mt-0.5">
                  <Info className="size-2.5 text-white" />
                </div>
                <div>
                  <h4 className="text-[#172C41] font-bold text-[11px] mb-1">Approval Process</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed">
                    Changes require admin approval. You will be notified of the decision within 24 hours via email and dashboard alert.
                  </p>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-sm tracking-wide"
              >
                Submit Change Request
              </Button>

              <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed">
                By submitting, you agree to our <span className="text-[#0061AA] underline">Terms of Service</span> regarding schedule modifications.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeFrequencyModal;
