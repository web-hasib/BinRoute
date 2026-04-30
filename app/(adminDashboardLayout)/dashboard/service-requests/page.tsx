"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";

import { Button } from "@/components/ui/button";
import {
  useGetServiceUpdateRequestsQuery,
  useApproveServiceRequestMutation,
  useRejectServiceRequestMutation
} from "@/redux/api/adminDashboard/serviceRequestApi";
import { format } from "date-fns";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ServiceRequestsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  // Reject Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<any | null>(null);

  const { data: requestsData, isLoading, isFetching } = useGetServiceUpdateRequestsQuery({
    page: currentPage,
    limit,
    status: activeTab,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const [approveRequest, { isLoading: isApproving }] = useApproveServiceRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectServiceRequestMutation();

  const requests = requestsData?.data || [];
  const meta = requestsData?.meta;

  console.log("requestsData", requestsData);
  console.log("requests", requests);

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id).unwrap();
      toast.success("Service request approved successfully");
      setIsDetailsModalOpen(false);
      setSelectedRequestDetails(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve service request");
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedRequestId(id);
    setRejectionReason("");
    setIsRejectModalOpen(true);
    setIsDetailsModalOpen(false); // Close details modal if open
  };

  const openDetailsModal = (request: any) => {
    setSelectedRequestDetails(request);
    setIsDetailsModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedRequestId) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await rejectRequest({ id: selectedRequestId, rejectionReason }).unwrap();
      toast.success("Service request rejected");
      setIsRejectModalOpen(false);
      setSelectedRequestId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject service request");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Requested By",
      cell: (item) => (
        <div>
          <p className="font-bold text-[#1A1A1A]">{item.subscription?.user?.fullName || "Unknown Customer"}</p>
          <p className="text-xs text-gray-500">{item.subscription?.user?.email || ""}</p>
        </div>
      )
    },
    {
      header: "Current Plan",
      cell: (item) => (
        <span className="font-semibold text-gray-700">{item.subscription?.plan?.category || "Unknown Plan"}</span>
      )
    },
    {
      header: "Date",
      cell: (item) => (
        <span className="text-gray-600 text-sm">
          {item.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a") : "N/A"}
        </span>
      )
    },
    {
      header: "Status",
      cell: (item) => (
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider",
          item.status === "PENDING" && "bg-orange-100 text-orange-800",
          item.status === "APPROVED" && "bg-green-100 text-green-800",
          item.status === "REJECTED" && "bg-red-100 text-red-800"
        )}>
          {item.status}
        </span>
      )
    },
    {
      header: "Action",
      cell: (item) => (
        <button
          onClick={() => openDetailsModal(item)}
          className="bg-blue-50 text-blue-600 font-bold px-4 py-1.5 text-xs rounded-none hover:bg-blue-100 transition-colors"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <Container>
      <PageHeader title="Service Update Requests" />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 mt-4">
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={cn(
              "px-6 py-3 text-sm font-bold border-b-2 transition-colors",
              activeTab === tab
                ? "border-[#0062FF] text-[#0062FF]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-none border border-gray-100 shadow-sm overflow-hidden mb-6">
        <DataTable
          columns={columns}
          data={requests}
          isLoading={isLoading || isFetching}
          className="border-none"
        />
      </div>

      {meta && meta.totalPage > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={meta.totalPage}
          onPageChange={setCurrentPage}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
        />
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Service Update Details"
      >
        {selectedRequestDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-none border border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 mb-2">Customer Details</h4>
                <p className="font-semibold text-gray-900">{selectedRequestDetails.subscription?.user?.fullName || "N/A"}</p>
                <p className="text-sm text-gray-600">{selectedRequestDetails.subscription?.user?.phone || "N/A"}</p>
                <p className="text-sm text-gray-600">{selectedRequestDetails.subscription?.user?.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-none border border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 mb-2">Current Service</h4>
                <p className="font-semibold text-gray-900">{selectedRequestDetails.subscription?.plan?.category || "Unknown Plan"}</p>
                <p className="text-sm text-gray-600">Frequency: {selectedRequestDetails.subscription?.serviceFrequency || "N/A"}</p>
                <p className="text-sm text-gray-600">Duration: {selectedRequestDetails.subscription?.contractDuration || "N/A"}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-none">
              <h4 className="text-sm font-bold text-[#0061AA] mb-3 border-b border-blue-100 pb-2">Requested Changes</h4>
              <div className="grid grid-cols-2 gap-y-3">
                {selectedRequestDetails.newServiceFrequency && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium">New Frequency</p>
                    <p className="font-bold text-gray-900">{selectedRequestDetails.newServiceFrequency}</p>
                  </div>
                )}
                {selectedRequestDetails.newServiceDays && selectedRequestDetails.newServiceDays.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium">New Service Days</p>
                    <p className="font-bold text-gray-900">{selectedRequestDetails.newServiceDays.join(", ")}</p>
                  </div>
                )}
                {selectedRequestDetails.newContractDuration && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium">New Duration</p>
                    <p className="font-bold text-gray-900">{selectedRequestDetails.newContractDuration}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 font-medium">Pricing Impact</p>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-gray-400 line-through">${selectedRequestDetails.currentTotalAmount || 0}</span>
                    <span className="text-green-600">${selectedRequestDetails.newTotalAmount || 0}</span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-1">Reason for Change</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 border border-gray-100">{selectedRequestDetails.reasonForChange || "No reason provided"}</p>
            </div>

            {selectedRequestDetails.status === "REJECTED" && selectedRequestDetails.rejectionReason && (
              <div>
                <h4 className="text-sm font-bold text-red-700 mb-1">Rejection Reason</h4>
                <p className="text-sm text-red-600 bg-red-50 p-3 border border-red-100">{selectedRequestDetails.rejectionReason}</p>
              </div>
            )}

            {selectedRequestDetails.status === "PENDING" && (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <Button
                  onClick={() => openRejectModal(selectedRequestDetails.id)}
                  disabled={isApproving || isRejecting}
                  className="bg-red-50 hover:bg-red-100 text-red-600 rounded-none px-6 shadow-none"
                >
                  Reject Request
                </Button>
                <Button
                  onClick={() => handleApprove(selectedRequestDetails.id)}
                  disabled={isApproving || isRejecting}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-none px-6"
                >
                  {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve Request"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Service Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please provide a reason for rejecting this service request. This will be sent to the customer.
          </p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Service not available in your area currently"
            className="w-full min-h-[120px] p-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none focus:ring-1 focus:ring-[#0265AF] resize-none"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
              className="rounded-none px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white rounded-none px-6 min-w-[100px]"
            >
              {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
