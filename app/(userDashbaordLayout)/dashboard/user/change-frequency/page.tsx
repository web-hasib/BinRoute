"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, ChevronDown, Eye, RefreshCw } from "lucide-react";
import { useState } from "react";
import ChangeFrequencyModal from "@/components/sections/dashboard/service-requests/ChangeFrequencyModal";
import ReschedulePickupModal from "@/components/sections/dashboard/service-requests/ReschedulePickupModal";
import ReportDamageModal from "@/components/sections/dashboard/service-requests/ReportDamageModal";
import MissingScheduleModal from "@/components/sections/dashboard/service-requests/MissingScheduleModal";
import ServiceSuccessModal from "@/components/ui/ServiceSuccessModal";
import ServiceRequestDetailModal from "@/components/sections/dashboard/service-requests/ServiceRequestDetailModal";
import { useGetMyServiceUpdateRequestsQuery } from "@/redux/api/subscription/subscriptionApi";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";



interface SuccessConfig {
  title: string;
  confirmationId: string;
  message: string;
}

const ServiceRequestsPage = () => {
  const [sortBy, setSortBy] = useState("createdAt");
  const [status, setStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessConfig | null>(null);

  const { data: requestsResponse, isFetching } = useGetMyServiceUpdateRequestsQuery({
    page: currentPage,
    limit: limit,
    sortBy: sortBy,
    // sortOrder: "desc",
    ...(status !== "All" && { status }),
  });

  const requests = requestsResponse?.data || [];
  const meta = requestsResponse?.meta;

  const handleOpenModal = (modalName: string) => setActiveModal(modalName);
  const handleCloseModal = () => setActiveModal(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmitSuccess = (type: string, data?: any) => {
    if (data) console.log(`Form submitted for ${type}:`, data);
    handleCloseModal();
    const config: Record<string, SuccessConfig> = {
      "frequency": { title: "Change Frequency Submitted Successfully", confirmationId: "CF-882941", message: "Your frequency update request has been received." },
      "reschedule": { title: "Reschedule Request Submitted Successfully", confirmationId: "RS-882942", message: "Your pickup reschedule request has been received." },
      "damage": { title: "Damage Report Submitted Successfully", confirmationId: "DR-882943", message: "Your premium waste management solution has been successfully provisioned and is ready for operation." },
      "missing": { title: "Missing Schedule Report Submitted", confirmationId: "MS-882944", message: "Your missing schedule report has been submitted for review." },
    };
    setSuccessData(config[type] || config.damage);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172C41]">Service Schedule Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track your dumpster rental service operations.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => handleOpenModal("missing")}
          className="text-[#0061AA] border-[#0061AA]/20 bg-[#E6F4FC] hover:bg-blue-100 rounded-none h-11 px-6 font-semibold"
        >
          Missing schedule report
        </Button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { id: "frequency", title: "Change Frequency", icon: RefreshCw, desc: "Update weekly or bi-weekly cycles" },
          { id: "reschedule", title: "Reschedule Pickup", icon: Calendar, desc: "Modify your existing pickup time" },
          { id: "damage", title: "Report Damage", icon: AlertCircle, desc: "Container repair or replacement request" },
        ].map((action, idx) => (
          <div key={idx} className="bg-white p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="flex gap-2">
            <div className="p-4 bg-gray-50 mb-4 border border-gray-50">
              <action.icon className="size-5 md:size-4 lg:size-6 text-[#172C41]" />
            </div>
            <div className="flex flex-col">
              <h3 className=" md:text-[12px] lg:text-base font-bold text-[#172C41] mb-1">{action.title}</h3>
              <p className="text-gray-400 md:text-[8px] lg:text-xs mb-6 px-4">{action.desc}</p>
            </div>
            </div>
            <Button 
              onClick={() => handleOpenModal(action.id)}
              className="w-full bg-[#E6F0F9] hover:bg-blue-100 text-[#0061AA] py-6 rounded-none font-bold border-none shadow-none"
            >
              Request now
            </Button>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ChangeFrequencyModal 
        isOpen={activeModal === "frequency"} 
        onClose={handleCloseModal}
        onSubmitSuccess={(data) => handleFormSubmitSuccess("frequency", data)}
      />
      
      <ReschedulePickupModal 
        isOpen={activeModal === "reschedule"} 
        onClose={handleCloseModal}
        onSubmitSuccess={(data) => handleFormSubmitSuccess("reschedule", data)}
      />

      <ReportDamageModal 
        isOpen={activeModal === "damage"} 
        onClose={handleCloseModal}
        onSubmitSuccess={(data) => handleFormSubmitSuccess("damage", data)}
      />

      <MissingScheduleModal 
        isOpen={activeModal === "missing"} 
        onClose={handleCloseModal}
        onSubmitSuccess={(data) => handleFormSubmitSuccess("missing", data)}
      />

      {successData && (
        <ServiceSuccessModal 
          isOpen={!!successData}
          onClose={() => setSuccessData(null)}
          title={successData.title}
          confirmationId={successData.confirmationId}
          message={successData.message}
        />
      )}

      <ServiceRequestDetailModal 
        isOpen={activeModal === "detail"}
        onClose={handleCloseModal}
        requestId={selectedRequestId}
      />

      {/* Request History Table */}
      <div className="bg-white p-4 md:p-8 rounded-none shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#172C41]">Service update requests</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">Status:</span>
              <div className="relative">
                <button 
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 border border-gray-100 cursor-pointer min-w-[120px] justify-between"
                >
                  <span className="text-[#172C41] font-bold text-[10px] uppercase">{status}</span>
                  <ChevronDown className={cn("size-3 text-gray-500 transition-transform", isStatusOpen && "rotate-180")} />
                </button>
                
                {isStatusOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsStatusOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 shadow-lg z-20 min-w-[140px]">
                      {["All", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatus(s);
                            setCurrentPage(1);
                            setIsStatusOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50",
                            status === s ? "text-[#0061AA] bg-blue-50" : "text-gray-600"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-y border-gray-100">
                <th className="px-6 py-4 text-center whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-center whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Requests type</th>
                <th className="px-6 py-4 text-center whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-center whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isFetching ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-8 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : requests.length > 0 ? (
                requests.map((req: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-6 whitespace-nowrap text-[#172C41] font-bold text-sm uppercase">
                      #{req.id.slice(-6)}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-gray-500 font-medium text-sm">
                      {req.newServiceFrequency ? "Change Frequency" : "Service Request"}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-[#172C41] font-bold text-sm">
                      ${req.newTotalAmount || req.currentTotalAmount}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={cn(
                        "inline-block px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-wider",
                        req.status === "APPROVED" ? "bg-green-50 text-green-500" : 
                        req.status === "REJECTED" ? "bg-red-50 text-red-500" : 
                        "bg-orange-50 text-orange-400"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-gray-500 font-medium text-sm">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-right">
                      <button 
                        onClick={() => {
                          setSelectedRequestId(req.id);
                          handleOpenModal("detail");
                        }}
                        className="p-2 text-gray-400 hover:text-[#006CF9] transition-colors cursor-pointer"
                      >
                        <Eye className="size-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    No service requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="mt-8">
            <CustomPagination 
              currentPage={currentPage}
              totalPages={meta.totalPage}
              onPageChange={setCurrentPage}
              rowsPerPage={limit}
              onRowsPerPageChange={setLimit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestsPage;