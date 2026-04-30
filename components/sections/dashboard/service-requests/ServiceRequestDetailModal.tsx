"use client";

import React from "react";
import { Check, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { useGetServiceUpdateRequestByIdQuery } from "@/redux/api/subscription/subscriptionApi";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ServiceRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
}

const ServiceRequestDetailModal = ({
  isOpen,
  onClose,
  requestId,
}: ServiceRequestDetailModalProps) => {
  const { data: response, isFetching } = useGetServiceUpdateRequestByIdQuery(requestId, {
    skip: !requestId,
  });

  const data = response?.data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-2xl p-0 overflow-hidden"
    >
      <div className="flex flex-col items-center text-center p-4 py-8 md:p-8 md:py-12">
        {isFetching ? (
          <div className="w-full space-y-6">
            <Skeleton className="size-24 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-4 pt-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-gray-50">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            <Skeleton className="h-16 w-full mt-4" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : data ? (
          <>
            {/* Status Icon */}
            <div className="relative mb-8">
              <div className={cn(
                "size-24 rounded-full flex items-center justify-center relative z-10",
                data.status === "APPROVED" ? "bg-[#22C55E]" : 
                data.status === "REJECTED" ? "bg-[#EF4444]" : "bg-[#F59E0B]"
              )}>
                {data.status === "APPROVED" ? (
                  <Check className="size-12 text-white stroke-[3px]" />
                ) : data.status === "REJECTED" ? (
                  <X className="size-12 text-white stroke-[3px]" />
                ) : (
                  <Info className="size-12 text-white stroke-[3px]" />
                )}
              </div>
              <div className={cn(
                "absolute -inset-3 border-2 rounded-full",
                data.status === "APPROVED" ? "border-[#22C55E]/20" : 
                data.status === "REJECTED" ? "border-[#EF4444]/20" : "border-[#F59E0B]/20"
              )} />
              <div className={cn(
                "absolute -inset-6 border-2 rounded-full",
                data.status === "APPROVED" ? "border-[#22C55E]/10" : 
                data.status === "REJECTED" ? "border-[#EF4444]/10" : "border-[#F59E0B]/10"
              )} />
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-3xl font-bold text-[#172C41] mb-2 px-2 md:px-4 leading-tight">
              Your Frequency Change Request Has Been {data.status === "PENDING" ? "Submitted" : data.status.charAt(0) + data.status.slice(1).toLowerCase()}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mb-8 md:mb-10 px-2 md:px-6 leading-relaxed max-w-md">
              Confirmation #{data.id.slice(-6).toUpperCase()}. 
              {data.status === "APPROVED" 
                ? "Your premium waste management solution has been successfully provisioned and is ready for operation."
                : data.status === "REJECTED"
                ? "Unfortunately, your request could not be processed at this time."
                : "Your frequency update request has been received and is under review."}
            </p>

            {/* Details Table */}
            <div className="w-full space-y-0.5 mb-8">
              {[
                { label: "Order Id", value: `#${data.id.slice(-6).toUpperCase()}` },
                { label: "Dumpster Size", value: data.subscription?.plan?.dumpsterSize || "N/A" },
                { label: "Contract Duration", value: data.newContractDuration || data.subscription?.contractDuration || "N/A" },
                { label: "Service Frequency", value: data.newServiceFrequency || data.subscription?.serviceFrequency || "N/A" },
                { label: "Selected Date", value: data.newServiceDays?.length > 0 ? data.newServiceDays.join(", ") : data.subscription?.serviceDays?.join(", ") || "N/A" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                  <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                  <span className="text-[#172C41] text-sm font-bold">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Total Amount Box */}
            <div className="w-full bg-[#F8F9FA] p-4 md:p-6 flex justify-between items-center mb-8">
              <span className="text-base md:text-lg font-bold text-[#172C41]">Total amount</span>
              <span className="text-xl md:text-2xl font-black text-[#172C41]">${data.newTotalAmount || data.currentTotalAmount}</span>
            </div>

            {/* Rejection Reason (if applicable) */}
            {data.status === "REJECTED" && (
              <div className="w-full bg-red-50 border border-red-100 p-6 mb-8 flex gap-4 text-left">
                <div className="p-1.5 bg-red-500 rounded-full h-fit mt-0.5">
                  <Info className="size-3 text-white" />
                </div>
                <div>
                  <h4 className="text-red-700 font-bold text-sm mb-1">Reason Of Rejection</h4>
                  <p className="text-red-600/80 text-xs leading-relaxed">
                    {data.rejectionReason || "Changes require admin approval. You will be notified of the decision within 24 hours via email and dashboard alert."}
                  </p>
                </div>
              </div>
            )}

            {/* Close Button */}
            <Button
              onClick={onClose}
              className="w-full bg-[#F8F9FA] hover:bg-gray-100 text-[#172C41] py-6 md:py-7 rounded-none font-bold text-sm uppercase tracking-wider border border-gray-100 shadow-none transition-colors"
            >
              Back to Dashboard
            </Button>
          </>
        ) : (
          <p className="text-gray-500">Failed to load request details.</p>
        )}
      </div>
    </Modal>
  );
};

export default ServiceRequestDetailModal;
