"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { UploadCloud, RefreshCw, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { useGetMySubscriptionsQuery, useSubmitReportMutation } from "@/redux/api/subscription/subscriptionApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomPagination } from "@/components/ui/CustomPagination";

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
  const [selectedSubscriptionId, setSelectedSubscriptionId] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 10;
  const { register, handleSubmit, reset, watch } = useForm<ReportDamageFormValues>();
  const [submitReport, { isLoading: isSubmitting }] = useSubmitReportMutation();
  const { data: subsResponse, isLoading: isLoadingSubs } = useGetMySubscriptionsQuery({ 
    page: currentPage, 
    limit: limit 
  });
  
  const subscriptions = subsResponse?.data?.data || [];
  const meta = subsResponse?.data?.meta;
  const selectedSubscription = subscriptions.find((sub: any) => sub.id === selectedSubscriptionId);

  const selectedFiles = watch("files");

  const onSubmit = async (data: ReportDamageFormValues) => {
    if (!selectedSubscriptionId) {
      toast.error("Please select a subscription first.");
      return;
    }

    if (!data.reason) {
      toast.error("Please provide a description of the damage.");
      return;
    }

    try {
      const formData = new FormData();
      
      // Handle file upload
      if (data.files && data.files.length > 0) {
        formData.append("damagePicture", data.files[0]);
      }

      // Handle JSON data
      const jsonData = {
        subscriptionId: selectedSubscriptionId,
        type: "REPORT_DAMAGE",
        reportDescription: data.reason,
      };
      
      formData.append("data", JSON.stringify(jsonData));

      const res = await submitReport(formData).unwrap();
      if (res.success) {
        toast.success("Damage report submitted successfully!");
        onSubmitSuccess(res.data);
        handleClose();
      }
    } catch (error: any) {
      console.error("Failed to submit report:", error);
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setSelectedSubscriptionId(null);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report Damage"
      description="Submit a damage report for your dumpster or container."
      className="max-w-4xl"
    >
      <div className="py-4">
        {!selectedSubscriptionId ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-[#172C41]">Select Affected Subscription</h3>
              <span className="text-xs text-gray-400 font-medium">{subscriptions.length} Subscriptions Found</span>
            </div>

            {isLoadingSubs ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : subscriptions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {subscriptions.map((sub: any) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubscriptionId(sub.id)}
                    className="flex items-center justify-between p-6 bg-white border border-gray-100 hover:border-[#0061AA] hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-none group-hover:bg-blue-50 transition-colors">
                        <AlertCircle className="size-5 text-[#172C41] group-hover:text-[#0061AA]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#172C41] font-bold text-sm uppercase tracking-wide">
                            {sub.plan?.dumpsterSize || "N/A"} {sub.plan?.category || "Plan"}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter",
                            sub.status === "ACTIVE" ? "bg-green-50 text-green-500" : "bg-orange-50 text-orange-500"
                          )}>
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs truncate max-w-md">{sub.dropoffAddress}</p>
                      </div>
                    </div>
                    <div className="text-[#0061AA] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs uppercase tracking-widest">
                      Select
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-200">
                <p className="text-gray-400">No subscriptions found.</p>
              </div>
            )}

            {/* Pagination for selection */}
            {meta && (
              <div className="mt-6 pt-6 border-t border-gray-50">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={meta.totalPages || meta.totalPage || 1}
                  onPageChange={setCurrentPage}
                  rowsPerPage={limit}
                  onRowsPerPageChange={() => {}} // Rows per page is fixed in selection
                  hideRowsPerPage={true}
                />
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between mb-2">
              <button 
                type="button"
                onClick={() => setSelectedSubscriptionId(null)}
                className="text-[#0061AA] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline"
              >
                ← Back to List
              </button>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Reporting Damage</h3>
            </div>

            {/* Selected Info */}
            <div className="bg-white border border-gray-100 p-8">
              <h3 className="text-sm font-bold text-[#172C41] mb-6">Subscription Details</h3>
              <div className="bg-[#F8F9FA] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border border-gray-100 shadow-sm">
                    <AlertCircle className="size-5 text-[#172C41]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Affected Container</p>
                    <p className="text-[#172C41] font-bold text-base">
                      {selectedSubscription?.plan?.dumpsterSize || "N/A"} • {selectedSubscription?.plan?.category || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Status</p>
                    <p className="text-[#172C41] font-bold text-base">{selectedSubscription?.status}</p>
                </div>
              </div>
            </div>

            {/* Upload Damage Picture */}
            <div className="bg-white border border-gray-100 p-8">
              <h3 className="text-sm font-bold text-[#172C41] mb-6">Upload Damage Picture</h3>
              <div className={cn(
                "border-2 border-dashed p-12 flex flex-col items-center text-center cursor-pointer transition-colors relative",
                selectedFiles?.length ? "border-green-200 bg-green-50/20" : "border-[#0061AA]/20 bg-[#F4F9FD]/50 hover:bg-[#F4F9FD]"
              )}>
                <input 
                    type="file" 
                    {...register("files")}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    title=""
                />
                <div className="p-4 bg-white shadow-sm border border-gray-100 mb-4 h-fit w-fit">
                  <UploadCloud className={cn("size-6", selectedFiles?.length ? "text-green-500" : "text-[#172C41]")} />
                </div>
                {selectedFiles?.length ? (
                  <>
                    <p className="text-green-600 text-sm font-bold mb-1">File Selected!</p>
                    <p className="text-gray-500 text-[10px]">{selectedFiles[0].name}</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-sm font-medium mb-1">Drag and drop photo</p>
                    <p className="text-gray-400 text-[10px] mb-6">Maximum 1 file allowed for damage proof. Formats: JPG, PNG.</p>
                    <Button type="button" variant="outline" className="border-gray-200 text-[#0061AA] bg-[#E6F0F9] hover:bg-blue-100 px-8 py-2 h-auto text-xs font-bold rounded-none">
                      Browse File
                    </Button>
                  </>
                )}
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

            <div className="flex gap-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setSelectedSubscriptionId(null)}
                className="flex-1 py-8 border-gray-100 text-gray-500 rounded-none font-bold text-sm uppercase tracking-wider"
              >
                Back
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-base tracking-wide disabled:opacity-50"
              >
                {isSubmitting ? "Submitting Report..." : "Send Report Requests"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ReportDamageModal;
