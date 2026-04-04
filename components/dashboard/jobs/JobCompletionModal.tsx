"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Job {
  id: string;
  location: string;
  serviceType: string;
  status: string;
  size: string;
}

interface JobCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobCompletionModal = ({ isOpen, onClose, job }: JobCompletionModalProps) => {
  if (!job) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="The driver just wrapped up the job!"
      className="max-w-3xl"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Summaries */}
          <div className="space-y-6">
            {/* Job Summary */}
            <div className="bg-gray-50/50 border border-gray-100 p-6 space-y-4">
              <h4 className="text-sm font-bold text-[#172C41] mb-2 tracking-tight">Job Summary <span className="font-normal text-gray-400">({job.id})</span></h4>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[13px] border-b border-gray-100 pb-3">
                    <span className="text-gray-500 font-medium tracking-tight">Location</span>
                    <span className="font-bold text-[#172C41]">{job.location}</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px] border-b border-gray-100 pb-3">
                    <span className="text-gray-500 font-medium tracking-tight">Service Name</span>
                    <span className="font-bold text-[#172C41]">{job.serviceType}</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px] border-b border-gray-100 pb-3">
                    <span className="text-gray-500 font-medium tracking-tight">Job Type</span>
                    <span className={job.status.includes('Drop-off') ? "font-bold text-[#FF630B]" : "font-bold text-[#22C55E]"}>
                      {job.status}
                    </span>
                 </div>
                 <div className="flex justify-between items-center text-[13px] border-b border-gray-100 pb-3">
                    <span className="text-gray-500 font-medium tracking-tight">Dumpster Size</span>
                    <span className="font-bold text-[#172C41]">{job.size}</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px] border-b border-gray-100 pb-3">
                    <span className="text-gray-500 font-medium tracking-tight">Included Weight</span>
                    <span className="font-bold text-[#172C41]">1 Ton</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500 font-medium tracking-tight">Date</span>
                    <span className="font-bold text-[#172C41]">12 June 2026</span>
                 </div>
              </div>
            </div>

            {/* Calculation Summary */}
            <div className="bg-gray-50/50 border border-gray-100 p-6 space-y-4">
              <h4 className="text-sm font-bold text-[#172C41] mb-2 tracking-tight">Calculation Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[13px] border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium tracking-tight">Overage</span>
                  <span className="font-bold text-[#172C41]">0.8 Tons</span>
                </div>
                <div className="flex justify-between items-center text-[15px] pt-1">
                  <span className="text-[#172C41] font-bold">Total Overage Fee</span>
                  <span className="font-extrabold text-[20px] text-[#172C41]">$111.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Photo & Notes */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-[#172C41] mb-3 tracking-tight">Proof of Service photo</h4>
              <div className="relative h-[200px] w-full bg-gray-50 border border-gray-100 overflow-hidden">
                <Image 
                  src="/dummy.png" 
                  alt="Proof of Service" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#172C41] mb-3 tracking-tight">Job Notes</h4>
              <div className="bg-[#F8FAFC] border border-gray-100 p-5 min-h-[140px]">
                <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                  &apos;Gate code is 4432. Container must be placed on the left side of the loading dock. Avoid blocking the fire hydrant. Driver must wear high-vis vest at all times.&apos;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <Button 
            className="w-full py-8 text-lg font-bold"
            variant="primary"
          >
            Mark as Complete
          </Button>
          
          <p className="text-[10px] text-gray-400 text-center leading-relaxed font-medium">
            The driver will receive an automated notification <br /> via the <span className="font-bold text-gray-400">Labonte Disposal</span> mobile app.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default JobCompletionModal;
