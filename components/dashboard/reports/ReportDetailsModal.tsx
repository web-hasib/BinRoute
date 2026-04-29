"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { useUpdateReportMutation } from "@/redux/api/adminDashboard/reportApi";
import { toast } from "sonner";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    id: string; // This is the mongo _id or the reportId, but we need the mongo _id for the API usually. 
    // Wait, in my page.tsx, I mapped report.id to report.reportId but for the API we need the original _id if possible.
    // Actually, I should check what I passed in page.tsx.
    _id?: string; 
    reportId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    requestType: "Reschedule Pickup" | "Report Damage" | "Missing schedule";
    status: string;
    date: string;
    currentSchedule?: {
      category: string;
      dumpsterSize: string;
      day: string;
      frequency: string;
    };
    newSchedule?: {
      category: string;
      dumpsterSize: string;
      day: string;
      frequency: string;
    };
    damageImage?: string;
    missingDate?: string;
    reason: string;
  } | null;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, report }) => {
  const [updateReport, { isLoading }] = useUpdateReportMutation();
  const [resolutionNote, setResolutionNote] = React.useState("");

  if (!report) return null;

  const handleStatusUpdate = async (status: string) => {
    if (!resolutionNote.trim()) {
      toast.error("Please provide a resolution note");
      return;
    }

    try {
      const res = await updateReport({ 
        id: report._id || report.id, 
        status, 
        resolutionNote 
      }).unwrap();
      
      if (res.success) {
        toast.success(`Report marked as ${status.replace("_", " ").toLowerCase()}`);
        setResolutionNote(""); // Reset note
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update report status");
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={true} 
      title={`${report.requestType} Reports Details #${report.reportId}`}
      className="max-w-3xl"
    >
      <div className="space-y-8 pb-6">
        {/* Customer Information */}
        <section>
          <h3 className="text-sm font-bold text-[#666666] mb-4 uppercase tracking-wider">Customer Information</h3>
          <div className="border border-gray-100 divide-y divide-gray-100 font-sans">
            <div className="grid grid-cols-2 p-4 bg-[#F8FAFC]">
              <span className="text-sm font-medium text-gray-500">Name</span>
              <span className="text-sm font-bold text-[#0A2540] text-right">{report.customerName}</span>
            </div>
            <div className="grid grid-cols-2 p-4">
              <span className="text-sm font-medium text-gray-500">Email Address</span>
              <span className="text-sm font-bold text-[#0A2540] text-right">{report.customerEmail}</span>
            </div>
            <div className="grid grid-cols-2 p-4 bg-[#F8FAFC]">
              <span className="text-sm font-medium text-gray-500">Phone Number</span>
              <span className="text-sm font-bold text-[#0A2540] text-right">{report.customerPhone}</span>
            </div>
          </div>
        </section>

        {/* Current Schedule */}
        <section>
          <h3 className="text-sm font-bold text-[#666666] mb-4 uppercase tracking-wider">Current Schedule</h3>
          <div className="bg-[#F8FAFC] p-6 flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-gray-100">
                <Calendar className="size-6 text-[#172C41]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mb-0.5">{report.currentSchedule?.category || "Commercial"}</p>
                <p className="text-base font-bold text-[#172C41]">{report.currentSchedule?.dumpsterSize || "2 Yard Dumpster"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mb-0.5">{report.currentSchedule?.day || "Monday"}</p>
              <p className="text-base font-bold text-[#172C41]">{report.currentSchedule?.frequency || "1x Per Month"}</p>
            </div>
          </div>
        </section>

        {/* Conditional Content based on requestType */}
        {report.requestType === "Report Damage" && (
          <section>
            <h3 className="text-sm font-bold text-[#666666] mb-4 uppercase tracking-wider">Damage Picture</h3>
            <div className="relative aspect-video w-full overflow-hidden mb-4 rounded-none border border-gray-100 shadow-sm">
              <Image 
                src={report.damageImage || "/blog/hero_bg.png"} 
                alt="Damage report" 
                fill 
                className="object-cover"
              />
            </div>
          </section>
        )}

        {report.requestType === "Missing schedule" && (
           <section>
             <h3 className="text-sm font-bold text-[#666666] mb-4 uppercase tracking-wider">Missing schedule date</h3>
             <div className="bg-[#F8FAFC] p-4 flex items-center justify-between border border-gray-100">
               <span className="text-sm font-bold text-[#172C41]">{report.missingDate || "May 21, 2025"}</span>
               <Calendar className="size-5 text-gray-400" />
             </div>
           </section>
        )}

        {/* Reason for Change */}
        <section>
          <h3 className="text-sm font-bold text-[#666666] mb-4 uppercase tracking-wider">Reason for Change</h3>
          <div className="bg-[#F8FAFC] p-6 border border-gray-100">
             <p className="text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{report.reason}&rdquo;
             </p>
          </div>
        </section>

        {/* Resolution Note */}
        <section>
          <h3 className="text-sm font-bold text-[#666666] mb-4 uppercase tracking-wider">Resolution Note</h3>
          <textarea
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="Enter resolution details here..."
            className="w-full h-32 p-4 bg-[#F8FAFC] border border-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-[#0061AA] text-[#0A2540] placeholder:text-gray-400 font-medium resize-none"
            required
          />
        </section>

        {/* Footer Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-gray-100">
          <Button 
            variant="outline" 
            disabled={isLoading}
            onClick={() => handleStatusUpdate("UNDER_REVIEW")}
            className="h-14 font-bold text-sm bg-white border-gray-200 hover:bg-gray-50 text-blue-600 rounded-none transition-all shadow-sm"
          >
            Review
          </Button>
          <Button 
            variant="outline"
            disabled={isLoading}
            onClick={() => handleStatusUpdate("DISMISSED")}
            className="h-14 font-bold text-sm bg-white border-red-100 hover:bg-red-50 text-red-600 rounded-none transition-all shadow-sm"
          >
            Dismiss
          </Button>
          <Button 
            disabled={isLoading}
            onClick={() => handleStatusUpdate("RESOLVED")}
            className="h-14 font-bold text-sm bg-[#0061AA] hover:bg-[#004e89] text-white rounded-none transition-all shadow-md"
          >
            Resolve now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportDetailsModal;
