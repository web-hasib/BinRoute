"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { UploadCloud } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CurrentScheduleInfo from "./CurrentScheduleInfo";

export interface ReportDamageFormValues {
  reason: string;
  files?: FileList;
}

interface ReportDamageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: ReportDamageFormValues) => void;
}

const ReportDamageModal = ({ isOpen, onClose, onSubmitSuccess }: ReportDamageModalProps) => {
  const { register, handleSubmit } = useForm<ReportDamageFormValues>();

  const onSubmit = (data: ReportDamageFormValues) => {
    console.log("Report Damage Form Data:", data);
    onSubmitSuccess(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Damage"
      description="Submit a damage report for your dumpster or container."
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
        <CurrentScheduleInfo />

        {/* Upload Damage Picture */}
        <div className="bg-white border border-gray-100 p-8">
          <h3 className="text-sm font-bold text-[#172C41] mb-6">Upload Damage Picture</h3>
          <div className="border-2 border-dashed border-[#0061AA]/20 bg-[#F4F9FD]/50 p-12 flex flex-col items-center text-center cursor-pointer hover:bg-[#F4F9FD] transition-colors relative">
            <input 
                type="file" 
                multiple 
                {...register("files")}
                className="absolute inset-0 opacity-0 cursor-pointer" 
                title=""
            />
            <div className="p-4 bg-white shadow-sm border border-gray-100 mb-4 h-fit w-fit">
              <UploadCloud className="size-6 text-[#172C41]" />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Drag and drop photo</p>
            <p className="text-gray-400 text-[10px] mb-6">Maximum 5 files allowed. Formats: JPG. PNG.</p>
            <Button type="button" variant="outline" className="border-gray-200 text-[#0061AA] bg-[#E6F0F9] hover:bg-blue-100 px-8 py-2 h-auto text-xs font-bold rounded-none">
              Browse File
            </Button>
          </div>
        </div>

        {/* Report an Issue */}
        <div className="bg-white border border-gray-100 p-8">
          <h3 className="text-sm font-bold text-[#172C41] mb-6">Report an Issue with Your Container</h3>
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

export default ReportDamageModal;
