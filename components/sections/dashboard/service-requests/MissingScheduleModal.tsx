"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CurrentScheduleInfo from "./CurrentScheduleInfo";

export interface MissingScheduleFormValues {
  missingDate: string;
  reason: string;
}

interface MissingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: MissingScheduleFormValues) => void;
}

const MissingScheduleModal = ({ isOpen, onClose, onSubmitSuccess }: MissingScheduleModalProps) => {
  const { register, handleSubmit } = useForm<MissingScheduleFormValues>({
    defaultValues: {
      missingDate: "May 21, 2025",
      reason: "",
    }
  });

  const onSubmit = (data: MissingScheduleFormValues) => {
    console.log("Missing Schedule Form Data:", data);
    onSubmitSuccess(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Missing schedule report"
      description="Submit a Missing schedule report your current service"
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
        <CurrentScheduleInfo />

        {/* Missing schedule date */}
        <div className="bg-white border border-gray-100 p-8">
          <h3 className="text-sm font-bold text-[#172C41] mb-6">Missing schedule date</h3>
          <div className="relative group">
            <input
              type="text"
              {...register("missingDate")}
              className="w-full p-5 bg-[#F8F9FA] border-none outline-none text-[#172C41] font-bold text-sm"
              placeholder="e.g. May 21, 2025"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
              <CalendarIcon className="size-4 text-gray-400" />
            </div>
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
          Send Report Requests
        </Button>
      </form>
    </Modal>
  );
};

export default MissingScheduleModal;
