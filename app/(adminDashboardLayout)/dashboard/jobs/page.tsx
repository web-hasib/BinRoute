"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Search } from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import JobCompletionModal from "@/components/dashboard/jobs/JobCompletionModal";
import { useGetAllSchedulesQuery } from "@/redux/api/adminDashboard/jobApi";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

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

const JobsPage = () => {
  const [activeService, setActiveService] = useState("ROLL_OFF");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortSetting, setSortSetting] = useState<string>("scheduledDate-asc");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [sortBy, sortOrder] = sortSetting.split("-") as ["scheduledDate" | "createdAt", "asc" | "desc"];

  const { data: jobsData, isLoading } = useGetAllSchedulesQuery({
    page: currentPage,
    limit: rowsPerPage,
    searchTerm: debouncedSearchTerm,
    category: activeService,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    sortBy: sortBy || "scheduledDate",
    sortOrder: sortOrder || "asc",
  });

  const jobs = jobsData?.data?.data || [];
  const meta = jobsData?.data?.meta;

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Job ID",
      cell: (job) => (
        <span className="font-bold text-[#172C41]">
          {job.jobCode ? job.jobCode : job.jobId ? `#${job.jobId.slice(-6).toUpperCase()}` : "N/A"}
        </span>
      ),
    },
    {
      header: "Customer Name",
      cell: (job) => (
        <div className="py-2">
          <p className="font-bold text-[#172C41]">{job.customerName || "N/A"}</p>
          <p className="text-xs text-gray-400 font-medium">{job.subscription?.user?.email || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Driver Name",
      cell: (job) => <span className="font-medium text-gray-600">{job.driverName || job.driver?.fullName || "Unassigned"}</span>,
    },
    {
      header: "Location",
      cell: (job) => (
        <p className="text-sm text-gray-600 font-medium truncate max-w-[200px]">{job.location || "N/A"}</p>
      ),
    },
    {
      header: "Size",
      cell: (job) => <span>{job.size || job.subscription?.plan?.dumpsterSize || "N/A"}</span>,
    },
    {
      header: "Schedule Date",
      cell: (job) => {
        const dateVal = job.scheduledDate || job.jobStartTime || job.createdAt;
        return (
          <span className="px-3 py-1.5 bg-[#F8FAFC] text-gray-700 text-xs font-semibold rounded-none border border-gray-100/80">
            {dateVal ? format(new Date(dateVal), "MM/dd/yyyy") : "N/A"}
          </span>
        );
      },
    },
    {
      header: "Status",
      cell: (job) => (
        <span
          className={cn(
            "px-3 py-1.5 text-[11px] font-bold tracking-tight rounded-none border uppercase inline-block",
            getStatusBadge(job.status)
          )}
        >
          {job.status?.replace(/_/g, " ") || "N/A"}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (job) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleViewDetails(job)}
            variant="primary"
            className="px-5 py-2 text-[13px] font-bold rounded-none"
          >
            View Details
          </Button>
          {job.status === "COMPLETED" && (
            <span className="px-2.5 py-1.5 text-[#22C55E] bg-[#F0FDF4] text-[11px] font-extrabold rounded-none border border-[#DCFCE7]">
              Done
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Container className="py-8">
      <PageHeader title="Today All Jobs" className="mb-8" />

      <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
        {/* Filters bar */}
        <div className="p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Job ID, customer, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-100 text-sm font-semibold text-gray-700 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DRIVER_SUBMITTED">Driver Submitted</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortSetting}
              onChange={(e) => {
                setSortSetting(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-[#F8FAFC] border border-gray-100 text-sm font-semibold text-gray-700 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
            >
              <option value="scheduledDate-asc">Schedule Date (Upcoming first)</option>
              <option value="scheduledDate-desc">Schedule Date (Furthest first)</option>
              <option value="createdAt-desc">Created Date (Newest first)</option>
              <option value="createdAt-asc">Created Date (Oldest first)</option>
            </select>
          </div>

          {/* Service Tabs */}
          <div className="flex items-center p-1 bg-[#F8FAFC] border border-gray-100 gap-1 self-start lg:self-auto">
            <button
              onClick={() => {
                setActiveService("ROLL_OFF");
                setCurrentPage(1);
              }}
              className={`px-6 py-2 text-sm font-bold transition-all ${
                activeService === "ROLL_OFF"
                  ? "bg-[#0265AF] text-white shadow-md rounded-none"
                  : "text-gray-500 hover:text-[#172C41]"
              }`}
            >
              Roll off Service
            </button>
            <button
              onClick={() => {
                setActiveService("COMMERCIAL");
                setCurrentPage(1);
              }}
              className={`px-6 py-2 text-sm font-bold transition-all ${
                activeService === "COMMERCIAL"
                  ? "bg-[#0265AF] text-white shadow-md rounded-none"
                  : "text-gray-500 hover:text-[#172C41]"
              }`}
            >
              Commercial Service
            </button>
          </div>
        </div>

        <DataTable columns={columns} data={jobs} isLoading={isLoading} className="border-none" />

        {/* Pagination */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={meta?.totalPage || 1}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          className="border-t border-gray-100"
        />
      </div>

      <JobCompletionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />
    </Container>
  );
};

export default JobsPage;