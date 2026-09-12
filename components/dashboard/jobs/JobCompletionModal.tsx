"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Loader2, X, Camera, FileText } from "lucide-react";
import { useCompleteJobMutation, useGetSingleJobQuery } from "@/redux/api/adminDashboard/jobApi";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface JobCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any | null;
}

const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DRIVER_SUBMITTED":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "IN_COMPLETED":
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const JobCompletionModal = ({ isOpen, onClose, job }: JobCompletionModalProps) => {
  const [completeJob, { isLoading: isCompleting }] = useCompleteJobMutation();

  const jobId = job?.jobId || job?.id;
  const { data: detailData, isLoading: isDetailLoading } = useGetSingleJobQuery(jobId, {
    skip: !isOpen || !jobId,
  });

  const detailedJob = detailData?.data || job;

  const handleComplete = async () => {
    if (!jobId) {
      toast.error("Job ID not found");
      return;
    }

    try {
      await completeJob(jobId).unwrap();
      toast.success("Job marked as completed");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to complete job");
    }
  };

  if (!job) return null;

  const displayId = detailedJob?.jobCode || (jobId ? `#${jobId.slice(-6).toUpperCase()}` : "N/A");
  const status = detailedJob?.status || "PENDING";
  const isCompleted = status === "COMPLETED";

  const scheduledDate = detailedJob?.scheduledDate || detailedJob?.jobStartTime;
  const createdDate = detailedJob?.createdAt;

  const proofPhotos: string[] = Array.isArray(detailedJob?.proofOfService)
    ? detailedJob.proofOfService
    : typeof detailedJob?.proofOfService === "string" && detailedJob.proofOfService
    ? [detailedJob.proofOfService]
    : [];

  const weightSlipPhotos: string[] = Array.isArray(detailedJob?.weightSlipPhoto)
    ? detailedJob.weightSlipPhoto
    : typeof detailedJob?.weightSlipPhoto === "string" && detailedJob.weightSlipPhoto
    ? [detailedJob.weightSlipPhoto]
    : [];

  const notesText = detailedJob?.notes || detailedJob?.instructions;
  const weightText = detailedJob?.landfillWeight
    ? `${detailedJob.landfillWeight} ton${detailedJob.landfillWeight > 1 ? "s" : ""}`
    : detailedJob?.size || detailedJob?.subscription?.plan?.dumpsterSize || "Standard (1 ton)";

  const customerName = detailedJob?.customerName || detailedJob?.subscription?.user?.fullName || "N/A";
  const customerEmail = detailedJob?.subscription?.user?.email || "N/A";
  const customerPhone = detailedJob?.subscription?.user?.phone || "N/A";
  const driverName = detailedJob?.driverName || detailedJob?.driver?.fullName || "Unassigned";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-2xl p-0 overflow-hidden rounded-none border-none max-h-[90vh] overflow-y-auto"
      showCloseButton={false}
    >
      <div className="relative bg-white">
        {/* Header */}
        <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#172C41]">
              {isCompleted
                ? `Job Details (${displayId})`
                : status === "DRIVER_SUBMITTED"
                ? "The driver just wrapped up the job!"
                : `Job Details (${displayId})`}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">View and manage service job information</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {isDetailLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0265AF]" />
            <p className="text-sm text-gray-500 font-medium">Loading job details...</p>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            {/* Job Summary Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#172C41]">Job Summary ({displayId})</h3>
                <span
                  className={cn(
                    "px-3 py-1 text-xs font-bold uppercase rounded-none border",
                    getStatusBadge(status)
                  )}
                >
                  {status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="border border-gray-100 rounded-none overflow-hidden">
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Customer</span>
                  <div className="text-right">
                    <span className="font-bold text-[#172C41] block text-sm">{customerName}</span>
                    <span className="text-xs text-gray-400">{customerEmail} • {customerPhone}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Assigned Driver</span>
                  <span className="text-right font-bold text-[#172C41] text-sm">{driverName}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Location</span>
                  <span className="text-right font-bold text-[#172C41] truncate text-sm">
                    {detailedJob?.location || detailedJob?.subscription?.dropoffAddress || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Service Name</span>
                  <span className="text-right font-bold text-[#172C41] text-sm">
                    {detailedJob?.serviceType || (detailedJob?.subscription?.plan?.category === "COMMERCIAL" ? "Commercial Service" : "Roll-off Service")}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Job Type</span>
                  <div className="flex justify-end">
                    <span className="px-2.5 py-0.5 bg-[#FFF4E5] text-[#FF630B] text-xs font-bold rounded-none uppercase">
                      {detailedJob?.jobType?.replace(/_/g, " ") || detailedJob?.type?.replace(/_/g, " ") || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Dumpster Size</span>
                  <span className="text-right font-bold text-[#172C41] text-sm">
                    {detailedJob?.size || detailedJob?.subscription?.plan?.dumpsterSize || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Weight</span>
                  <span className="text-right font-bold text-[#172C41] text-sm">{weightText}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <span className="text-gray-500 font-medium text-sm">Schedule Date</span>
                  <span className="text-right font-bold text-[#172C41] text-sm">
                    {scheduledDate ? format(new Date(scheduledDate), "dd MMMM yyyy, hh:mm a") : "N/A"}
                  </span>
                </div>
                {createdDate && (
                  <div className="grid grid-cols-2 p-3.5 hover:bg-gray-50/50 transition-colors">
                    <span className="text-gray-500 font-medium text-sm">Created Date</span>
                    <span className="text-right font-bold text-gray-600 text-sm">
                      {format(new Date(createdDate), "dd MMMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Proof of Service & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#172C41] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-gray-500" />
                  Proof of Service Photo
                </h3>
                {proofPhotos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {proofPhotos.map((photo, index) => (
                      <div key={index} className="aspect-video relative bg-gray-100 border border-gray-200 overflow-hidden">
                        <Image
                          src={photo}
                          alt={`Proof of service ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video relative bg-gray-50 border border-gray-200 flex flex-col items-center justify-center p-4 text-center">
                    <Camera className="w-8 h-8 text-gray-300 mb-1" />
                    <p className="text-xs text-gray-400 font-medium">No proof of service photo uploaded yet</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#172C41] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Job Notes & Instructions
                </h3>
                <div className="p-4 bg-gray-50/50 border border-gray-100 min-h-[140px] flex items-center">
                  {notesText ? (
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{notesText}"
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No notes provided for this job.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Weight Slip Photos if any */}
            {weightSlipPhotos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#172C41]">Weight Slip Photos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {weightSlipPhotos.map((photo, index) => (
                    <div key={index} className="aspect-video relative bg-gray-100 border border-gray-200 overflow-hidden">
                      <Image
                        src={photo}
                        alt={`Weight slip ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action */}
            <div className="space-y-4 pt-2">
              {isCompleted ? (
                <div className="w-full py-4 text-center bg-[#F0FDF4] text-[#22C55E] text-base font-bold rounded-none border border-[#DCFCE7]">
                  Job Completed
                </div>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="w-full py-6 text-base font-bold rounded-none shadow-md transition-transform active:scale-[0.98]"
                  variant={"primary"}
                >
                  {isCompleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Mark as Complete"}
                </Button>
              )}

              <p className="text-xs text-gray-400 text-center leading-relaxed max-w-sm mx-auto font-medium">
                The driver will receive an automated notification via the <span className="font-bold text-gray-600">Bin Route</span> mobile app.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default JobCompletionModal;
