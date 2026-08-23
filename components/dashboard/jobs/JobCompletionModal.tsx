"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useCompleteJobMutation } from "@/redux/api/adminDashboard/jobApi";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

interface JobCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any | null;
}

const JobCompletionModal = ({ isOpen, onClose, job }: JobCompletionModalProps) => {
  const [completeJob, { isLoading: isCompleting }] = useCompleteJobMutation();

  const handleComplete = async () => {
    if (!job?.jobId) {
        toast.error("Job ID not found");
        return;
    }

    try {
        await completeJob(job.jobId).unwrap();
        toast.success("Job marked as completed");
        onClose();
    } catch (error: any) {
        toast.error(error?.data?.message || "Failed to complete job");
    }
  };

  if (!job) return null;

  const displayId = job.jobId ? `#${job.jobId.slice(-6).toUpperCase()}` : "N/A";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      className="max-w-2xl p-0 overflow-hidden rounded-none border-none"
      showCloseButton={false}
    >
      <div className="relative bg-white">
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-2xl font-bold text-[#172C41]">The driver just wrapped up the job!</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Job Summary Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#172C41]">Job Summary ({displayId})</h3>
            <div className="border border-gray-100 rounded-none overflow-hidden">
              <div className="grid grid-cols-2 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <span className="text-gray-500 font-medium">Location</span>
                <span className="text-right font-bold text-[#172C41] truncate">{job.location || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <span className="text-gray-500 font-medium">Service Name</span>
                <span className="text-right font-bold text-[#172C41]">{job.serviceType || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <span className="text-gray-500 font-medium">Job Type</span>
                <div className="flex justify-end">
                  <span className="px-3 py-1 bg-[#FFF4E5] text-[#FF630B] text-xs font-bold rounded-none uppercase">
                    {job.jobType?.replace(/_/g, " ") || "N/A"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <span className="text-gray-500 font-medium">Dumpster Size</span>
                <span className="text-right font-bold text-[#172C41]">{job.size || job.subscription?.plan?.dumpsterSize || "N/A"}</span>
              </div>
              <div className="grid grid-cols-2 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <span className="text-gray-500 font-medium">Included Weight</span>
                <span className="text-right font-bold text-[#172C41]">1 ton</span>
              </div>
              <div className="grid grid-cols-2 p-4 hover:bg-gray-50/50 transition-colors">
                <span className="text-gray-500 font-medium">Date</span>
                <span className="text-right font-bold text-[#172C41]">
                  {job.scheduledDate ? format(new Date(job.scheduledDate), "dd MMMM yyyy") : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Proof of Service & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#172C41]">Proof of Service photo</h3>
              <div className="aspect-video relative bg-gray-100 border border-gray-200 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80" 
                  alt="Proof of service" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#172C41]">Job Notes</h3>
              <div className="p-6 bg-gray-50/50 border border-gray-100 min-h-[140px]">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "Gate code is 4492. Container must be placed on the left side of the loading dock. Avoid blocking the fire hydrant. Driver must wear high-vis vest at all times."
                </p>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="space-y-6 pt-4">
            <Button 
              onClick={handleComplete}
              disabled={isCompleting || job.status === "COMPLETED"}
              className="w-full py-7 text-lg font-bold rounded-none shadow-lg transition-transform active:scale-[0.98]"
              variant={"primary"}
            >
              {isCompleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Mark as Complete"}
            </Button>
            
            <p className="text-sm text-gray-400 text-center leading-relaxed max-w-sm mx-auto font-medium">
              The driver will receive an automated notification via the <span className="font-bold">Labonte Disposal</span> mobile app.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JobCompletionModal;
