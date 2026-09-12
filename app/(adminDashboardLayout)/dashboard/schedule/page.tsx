"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Search } from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import DriverAssignmentModal from "@/components/dashboard/schedule/DriverAssignmentModal";

interface Job {
  id: string;
  customer: { name: string; email: string };
  serviceType: string;
  location: string;
  size: string;
  status: string;
  isAssigned: boolean;
}

const mockJobs: Job[] = [
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-Off",
    isAssigned: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-Off",
    isAssigned: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-Off",
    isAssigned: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Pickup",
    isAssigned: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Pickup",
    isAssigned: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Pickup",
    isAssigned: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-Off",
    isAssigned: true,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-Off",
    isAssigned: true,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-Off",
    isAssigned: true,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-Off",
    isAssigned: true,
  },
];

import { useGetAllSchedulesQuery, ISchedule } from "@/redux/api/adminDashboard/jobApi";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";

const SchedulePage = () => {
  const [activeService, setActiveService] = useState("ROLL_OFF");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ISchedule | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: scheduleData, isLoading } = useGetAllSchedulesQuery({
    page: currentPage,
    limit: rowsPerPage,
    searchTerm: debouncedSearchTerm,
    category: activeService,
    sortBy: "scheduledDate",
    // sortOrder: "asc"
  });

  const schedules = scheduleData?.data?.data || [];
  const meta = scheduleData?.data?.meta;

  const handleAssignClick = (job: ISchedule) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<ISchedule>[] = [
    {
      header: "Job ID",
      accessorKey: "jobId",
      cell: (job) => <span className="font-bold text-[#172C41]">#{job.jobId.slice(-6).toUpperCase()}</span>
    },
    {
      header: "Customer Name",
      cell: (job) => (
        <div className="py-2">
          <p className="font-bold text-[#172C41]">{job.customerName}</p>
          <p className="text-xs text-gray-400 font-medium">{job.subscription?.user?.email || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Service Type",
      accessorKey: "serviceType",
    },
    {
      header: "Location",
      cell: (job) => (
        <p className="text-sm text-gray-600 font-medium truncate max-w-[200px]">{job.location}</p>
      )
    },
    {
      header: "Size",
      accessorKey: "size",
    },
    {
      header: "Schedule Date",
      cell: (job) => (
        <span className="px-3 py-1.5 bg-[#F8FAFC] text-gray-500 font-bold tracking-tight rounded-none border border-gray-100/50">
          {format(new Date(job.scheduledDate), "MM/dd/yyyy")}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (job) => (
        <span className="px-3 py-1.5 bg-[#F8FAFC] text-gray-500 text-[11px] font-bold tracking-tight rounded-none border border-gray-100/50">
          {job.jobType.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (job) => (
        <div className="flex justify-start">
          {job.driverId ? (
            <div className="flex items-center gap-2 px-6 py-2 border-2 border-[#EBF6FF] text-[#22C55E] bg-[#F0FDF4] text-[13px] font-bold rounded-none cursor-default">
              Assigned ({job.driverName || "Driver"})
            </div>
          ) : (
            <Button
              onClick={() => handleAssignClick(job)}
              variant={"primary"}
              className="py-2 text-[13px] font-bold rounded-none"
            >
              Assign Driver
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Container className="py-8">
      <PageHeader title="Today All Schedule" className="mb-8" />

      <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
        {/* Filters and Tabs */}
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-none rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
            />
          </div>

          <div className="flex items-center p-1 bg-[#F8FAFC] border border-gray-100 gap-1">
            <button 
              onClick={() => setActiveService("ROLL_OFF")}
              className={`px-8 py-2.5 text-sm font-bold transition-all ${
                activeService === "ROLL_OFF" 
                  ? "bg-[#0265AF] text-white rounded-none shadow-md" 
                  : "text-gray-500 hover:text-[#172C41]"
              }`}
            >
              Roll off Service
            </button>
            <button 
              onClick={() => setActiveService("COMMERCIAL")}
              className={`px-8 py-2.5 text-sm font-bold transition-all ${
                activeService === "COMMERCIAL" 
                  ? "bg-[#0265AF] text-white rounded-none shadow-md" 
                  : "text-gray-500 hover:text-[#172C41]"
              }`}
            >
              Commercial Service
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <DataTable columns={columns} data={schedules} isLoading={isLoading} className="border-none shadow-none" />

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

      {/* Driver Assignment Modal */}
      <DriverAssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />
    </Container>
  );
};

export default SchedulePage;