"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CurrentScheduleInfo from "./CurrentScheduleInfo";
import { cn } from "@/lib/utils";

export interface ReschedulePickupFormValues {
  serviceDays: string[];
  reason: string;
}

interface ReschedulePickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: ReschedulePickupFormValues) => void;
}

const ReschedulePickupModal = ({ isOpen, onClose, onSubmitSuccess }: ReschedulePickupModalProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<ReschedulePickupFormValues>({
    defaultValues: {
      serviceDays: ["Mon"],
      reason: "",
    }
  });

  const selectedDays = watch("serviceDays");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const onSubmit = (data: ReschedulePickupFormValues) => {
    console.log("Reschedule Pickup Form Data:", data);
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
      title="Change the pickup day for your service"
      description="Manage and track your dumpster rental service operations."
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
        <CurrentScheduleInfo />

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
          <h3 className="text-sm font-bold text-[#172C41] mb-6">Reason for Change</h3>
          <textarea
            {...register("reason")}
            placeholder="Please provide any additional context for the administrator..."
            className="w-full p-6 bg-[#F8F9FA] border-none outline-none text-gray-800 placeholder:text-gray-400 min-h-[160px] resize-none text-sm"
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-base tracking-wide"
        >
          Send Service Requests
        </Button>
      </form>
    </Modal>
  );
};

export default ReschedulePickupModal;
