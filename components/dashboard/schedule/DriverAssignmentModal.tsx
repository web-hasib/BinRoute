"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { ISchedule, useAssignJobMutation } from "@/redux/api/adminDashboard/jobApi";
import { useGetAllDriversQuery } from "@/redux/api/adminDashboard/driverApi";
import { toast } from "sonner";
import { format } from "date-fns";

interface DriverAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: ISchedule | null;
}

const DriverAssignmentModal = ({ isOpen, onClose, job }: DriverAssignmentModalProps) => {
  const [driverId, setDriverId] = useState("");
  const [instructions, setInstructions] = useState("");
  
  // API Hooks
  const { data: driversData, isLoading: isDriversLoading } = useGetAllDriversQuery({});
  const [assignJob, { isLoading: isAssigning }] = useAssignJobMutation();

  const drivers = driversData?.data?.data || [];

  const handleAssign = async () => {
    if (!job || !driverId) {
        toast.error("Please select a driver");
        return;
    }

    try {
        await assignJob({
            driverId,
            jobId: job.jobId,
            type: job.jobType,
            jobStartTime: job.scheduledDate,
            instructions
        }).unwrap();
        
        toast.success("Job assigned successfully");
        onClose();
        setDriverId("");
        setInstructions("");
    } catch (error: any) {
        toast.error(error?.data?.message || "Failed to assign job");
    }
  };

  if (!job) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Driver Assignment"
      className="max-w-xl"
    >
      <div className="space-y-6">
        {/* Job Summary */}
        <div className="bg-gray-50/50 border border-gray-100 p-6 space-y-4">
          <h4 className="text-sm font-bold text-[#172C41] mb-2">Job Summary</h4>
          
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium tracking-tight">Address</span>
                <span className="font-bold text-[#172C41] truncate max-w-[300px]">{job.location}</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium tracking-tight">Service Name</span>
                <span className="font-bold text-[#172C41]">{job.serviceType}</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium tracking-tight">Service Type</span>
                <span className="font-bold text-[#FF630B]">{job.jobType.replace("_", " ")}</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium tracking-tight">Dumpster Size</span>
                <span className="font-bold text-[#172C41]">{job.size}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium tracking-tight">Date</span>
                <span className="font-bold text-[#172C41]">{format(new Date(job.scheduledDate), "dd MMM yyyy")}</span>
             </div>
          </div>
        </div>

        {/* Select Driver */}
        <div>
          <label className="block text-sm font-bold text-[#172C41] mb-2 tracking-tight">Select Driver</label>
          <div className="relative">
            <select 
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                disabled={isDriversLoading}
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-none appearance-none focus:outline-none focus:ring-1 focus:ring-[#0265AF] text-[#172C41] disabled:opacity-50"
            >
              <option value="">{isDriversLoading ? "Loading drivers..." : "Choose a driver..."}</option>
              {drivers.map((driver: any) => (
                  <option key={driver.id} value={driver.id}>{driver.fullName}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Driver Instructions */}
        <div>
          <label className="block text-sm font-bold text-[#172C41] mb-2 tracking-tight">Driver Instructions</label>
          <textarea 
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Drop at the north gate, customer will meet on site..."
            className="w-full px-4 py-4 bg-white border border-gray-100 rounded-none h-32 focus:outline-none focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-400"
          ></textarea>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 py-6 font-bold border-gray-200 rounded-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={isAssigning}
            className="flex-1"
            variant={"primary"}
          >
            {isAssigning ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Assign Job"}
          </Button>
        </div>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed font-medium">
          The driver will receive an automated notification <br /> via the <span className="font-bold">Labonte Disposal</span> mobile app.
        </p>
      </div>
    </Modal>
  );
};

export default DriverAssignmentModal;
