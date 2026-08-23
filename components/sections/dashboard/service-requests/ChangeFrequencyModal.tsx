"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useCreateServiceUpdateRequestMutation, useGetMySubscriptionsQuery } from "@/redux/api/subscription/subscriptionApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw } from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";

interface ChangeFrequencyFormValues {
  frequency: string;
  serviceDays: string[];
  contractDuration: string;
  reason: string;
}

interface ChangeFrequencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: ChangeFrequencyFormValues) => void;
}

const ChangeFrequencyModal = ({ isOpen, onClose, onSubmitSuccess }: ChangeFrequencyModalProps) => {
  const [selectedSubscriptionId, setSelectedSubscriptionId] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 10;

  const { register, handleSubmit, watch, setValue, reset } = useForm<ChangeFrequencyFormValues>({
    defaultValues: {
      frequency: "1x/week",
      serviceDays: ["Monday"],
      contractDuration: "1 year",
      reason: "",
    }
  });

  const selectedFrequency = watch("frequency");
  const selectedDays = watch("serviceDays");
  const selectedDuration = watch("contractDuration");

  const frequencies = [
    "1x/week", "2x/week", "3x/week",
    "4x/week", "5x/week", "6x/week", "7x/week",
    "Every other week", "Once a month", "Twice a month"
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const durations = ['1 year', '2 year', '3 year'];

  const getMaxDays = (freq: string) => {
    if (freq.includes("1x/week")) return 1;
    if (freq.includes("2x/week")) return 2;
    if (freq.includes("3x/week")) return 3;
    if (freq.includes("4x/week")) return 4;
    if (freq.includes("5x/week")) return 5;
    if (freq.includes("6x/week")) return 6;
    if (freq.includes("7x/week")) return 7;
    if (freq === "Every other week") return 1;
    if (freq === "Once a month") return 1;
    if (freq === "Twice a month") return 2;
    return 1;
  };

  const handleFrequencyChange = (freq: string) => {
    setValue("frequency", freq);
    const max = getMaxDays(freq);
    if (selectedDays.length > max) {
      setValue("serviceDays", selectedDays.slice(0, max));
    }
  };

  const toggleDay = (day: string) => {
    const max = getMaxDays(selectedFrequency);
    const currentDays = [...selectedDays];
    
    if (currentDays.includes(day)) {
      setValue("serviceDays", currentDays.filter(d => d !== day));
    } else {
      if (currentDays.length < max) {
        setValue("serviceDays", [...currentDays, day]);
      } else if (max === 1) {
        setValue("serviceDays", [day]);
      }
    }
  };

  const [createServiceRequest, { isLoading: isSubmitting }] = useCreateServiceUpdateRequestMutation();
  const { data: subsResponse, isLoading: isLoadingSubs } = useGetMySubscriptionsQuery({ 
    page: currentPage, 
    limit: limit 
  });
  
  const subscriptions = (subsResponse?.data?.data || []).filter((sub: any) => sub.plan?.category === "COMMERCIAL");
  const meta = subsResponse?.data?.meta;
  const selectedSubscription = subscriptions.find((sub: any) => sub.id === selectedSubscriptionId);

  const onSubmit = async (data: ChangeFrequencyFormValues) => {
    if (!selectedSubscription) {
      toast.error("Please select a subscription first.");
      return;
    }

    try {
      const payload = {
        subscriptionId: selectedSubscription.id,
        newServiceFrequency: data.frequency,
        newServiceDays: data.serviceDays,
        newContractDuration: data.contractDuration,
        reasonForChange: data.reason,
      };

      const res = await createServiceRequest(payload).unwrap();
      if (res.success) {
        toast.success("Service update request submitted successfully!");
        onSubmitSuccess(res.data);
        setSelectedSubscriptionId(null);
        reset();
      }
    } catch (error: any) {
      console.error("Failed to submit request:", error);
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Frequency Service Schedule"
      description="Manage and track your dumpster rental service operations."
      className="max-w-4xl"
    >
      <div className="py-4">
        {!selectedSubscriptionId ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-[#172C41]">Select Subscription</h3>
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
                    onClick={() => {
                      setSelectedSubscriptionId(sub.id);
                      // Pre-fill form with current values if it's a commercial plan
                      if (sub.serviceFrequency) setValue("frequency", sub.serviceFrequency);
                      if (sub.serviceDays) setValue("serviceDays", sub.serviceDays);
                      if (sub.contractDuration) setValue("contractDuration", sub.contractDuration);
                    }}
                    className="flex items-center justify-between p-6 bg-white border border-gray-100 hover:border-[#0061AA] hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-none group-hover:bg-blue-50 transition-colors">
                        <RefreshCw className="size-5 text-[#172C41] group-hover:text-[#0061AA]" />
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
                        <p className="text-gray-400 text-[10px] mt-1">
                          {sub.serviceFrequency || "No Frequency"} • {sub.contractDuration || "No Duration"}
                        </p>
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
                <p className="text-gray-400">No active subscriptions found.</p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <button 
                type="button"
                onClick={() => setSelectedSubscriptionId(null)}
                className="text-[#0061AA] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline"
              >
                ← Back to List
              </button>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Updating Subscription</h3>
            </div>

            {/* Current Schedule */}
            <div className="bg-white border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-[#172C41]">Current Schedule</h3>
                <button 
                  type="button"
                  onClick={() => setSelectedSubscriptionId(null)}
                  className="text-[10px] font-bold text-[#0061AA] uppercase hover:underline"
                >
                  Change Subscription
                </button>
              </div>
              <div className="bg-[#F8F9FA] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border border-gray-100 shadow-sm">
                    <RefreshCw className="size-5 text-[#172C41]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Commercial Schedule</p>
                    <p className="text-[#172C41] font-bold text-base">
                      {selectedSubscription?.serviceFrequency || "N/A"} • {selectedSubscription?.contractDuration || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                      {selectedSubscription?.serviceDays?.join(", ") || "No Days Set"}
                    </p>
                    <p className="text-[#172C41] font-bold text-base">
                      {selectedSubscription?.plan?.dumpsterSize || "2 Yard Dumpster"}
                    </p>
                </div>
              </div>
            </div>

            {/* Update Frequency */}
            <div className="bg-white border border-gray-100 p-6 md:p-8">
              <h3 className="text-base font-bold text-[#172C41] mb-6">Update Frequency</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {frequencies.map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => handleFrequencyChange(freq)}
                    className={cn(
                      "p-4 text-sm font-semibold border transition-all text-center",
                      selectedFrequency === freq
                        ? "border-[#0061AA] text-[#0061AA] bg-white ring-1 ring-[#0061AA]"
                        : "border-gray-100 text-gray-400 bg-white hover:border-gray-200"
                    )}
                  >
                    {freq.replace('x/week', 'x Per Week')}
                  </button>
                ))}
              </div>
            </div>

            {/* Select New Service Days */}
            <div className="bg-white border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-[#172C41]">Select New Service Days</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Select up to {getMaxDays(selectedFrequency)} day(s)
                </span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "p-4 text-sm font-semibold border transition-all text-center",
                      selectedDays.includes(day)
                        ? "border-[#0061AA] text-[#0061AA] ring-1 ring-[#0061AA]"
                        : "border-gray-100 text-gray-400 bg-white hover:border-gray-200"
                    )}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Contract Duration */}
            <div className="bg-white border border-gray-100 p-6 md:p-8">
              <h3 className="text-base font-bold text-[#172C41] mb-6">Select Contract Duration</h3>
              <div className="grid grid-cols-3 gap-4">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setValue("contractDuration", duration)}
                    className={cn(
                      "p-4 text-sm font-semibold border transition-all text-center capitalize",
                      selectedDuration === duration
                        ? "border-[#0061AA] text-[#0061AA] ring-1 ring-[#0061AA]"
                        : "border-gray-100 text-gray-400 bg-white hover:border-gray-200"
                    )}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason for Change */}
            <div className="bg-white border border-gray-100 p-6 md:p-8">
              <h3 className="text-base font-bold text-[#172C41] mb-6">Reason for Change (Optional)</h3>
              <textarea
                {...register("reason")}
                placeholder="Please provide any additional context for the administrator..."
                className="w-full p-6 bg-[#F8F9FA] border-none outline-none text-gray-800 placeholder:text-gray-400 min-h-[120px] resize-none text-sm"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setSelectedSubscriptionId(null)}
                className="flex-1 py-7 border-gray-100 text-gray-500 rounded-none font-bold text-sm uppercase tracking-wider"
              >
                Back
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#0061AA] hover:bg-[#004e89] text-white py-7 rounded-none font-bold text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ChangeFrequencyModal;
