"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface DriverAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    location: string;
    serviceType: string;
    status: string;
    size: string;
  } | null;
}

const DriverAssignmentModal = ({ isOpen, onClose, job }: DriverAssignmentModalProps) => {
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
                <span className="font-bold text-[#172C41]">{job.location}</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium tracking-tight">Service Name</span>
                <span className="font-bold text-[#172C41]">{job.serviceType}</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium tracking-tight">Service Type</span>
                <span className="font-bold text-[#FF630B]">{job.status}</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium tracking-tight">Dumpster Size</span>
                <span className="font-bold text-[#172C41]">{job.size}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium tracking-tight">Date</span>
                <span className="font-bold text-[#172C41]">12 June 2026</span>
             </div>
          </div>
        </div>

        {/* Select Driver */}
        <div>
          <label className="block text-sm font-bold text-[#172C41] mb-2 tracking-tight">Select Driver</label>
          <div className="relative">
            <select className="w-full px-4 py-3 bg-white border border-gray-100 rounded-none appearance-none focus:outline-none focus:ring-1 focus:ring-[#0265AF] text-[#172C41]">
              <option value="">Choose a driver...</option>
              <option value="driver1">John Doe</option>
              <option value="driver2">Jane Smith</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Driver Instructions */}
        <div>
          <label className="block text-sm font-bold text-[#172C41] mb-2 tracking-tight">Driver Instructions</label>
          <textarea 
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
            className="flex-1"
            variant={"primary"}
          >
            Assign Job
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
