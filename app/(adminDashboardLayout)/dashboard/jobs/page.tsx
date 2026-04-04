"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Search } from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import JobCompletionModal from "@/components/dashboard/jobs/JobCompletionModal";

interface Job {
  id: string;
  customer: { name: string; email: string };
  driverName: string;
  serviceType: string;
  location: string;
  size: string;
  status: string;
  isCompleted: boolean;
}

const mockJobs: Job[] = [
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Sofia Lin",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-off",
    isCompleted: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Jasper Mendez",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-off",
    isCompleted: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Amara Patel",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-off",
    isCompleted: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Liam Chen",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Pickup",
    isCompleted: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Rosa Martinez",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Pickup",
    isCompleted: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Ethan Gallagher",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Pickup",
    isCompleted: false,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Maya Thompson",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-off",
    isCompleted: true,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Noah Kim",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-off",
    isCompleted: true,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Zara Ali",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-off",
    isCompleted: true,
  },
  {
    id: "Job #LD-8829",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    driverName: "Aiden Brooks",
    serviceType: "Roll of Service",
    location: "123 Industrial Way, Suite B",
    size: "20 Yard",
    status: "Dumpster Drop-off",
    isCompleted: true,
  },
];

const JobsPage = () => {
  const [activeService, setActiveService] = useState("Roll off Service");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<Job>[] = [
    {
      header: "Job ID",
      accessorKey: "id",
    },
    {
      header: "Customer Name",
      cell: (job) => (
        <div className="py-2">
          <p className="font-bold text-[#172C41]">{job.customer.name}</p>
          <p className="text-xs text-gray-400 font-medium">{job.customer.email}</p>
        </div>
      ),
    },
    {
      header: "Driver Name",
      accessorKey: "driverName",
    },
    {
      header: "Location",
      cell: (job) => (
        <p className="text-sm text-gray-600 font-medium whitespace-nowrap">{job.location}</p>
      )
    },
    {
      header: "Size",
      accessorKey: "size",
    },
    {
      header: "Status",
      cell: (job) => (
        <span className="px-3 py-1.5 bg-[#F8FAFC] text-gray-500 text-[11px] font-bold tracking-tight rounded-none border border-gray-100/50">
          {job.status}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (job) => (
        <div className="flex justify-start">
          {job.isCompleted ? (
            <span className="px-6 py-2 text-[#22C55E] bg-[#F0FDF4] text-[13px] font-extrabold rounded-none border border-[#DCFCE7]">
              Completed
            </span>
          ) : (
            <Button
              onClick={() => handleViewDetails(job)}
              variant="primary"
              className="px-6 py-2 text-[13px] font-bold rounded-none"
            >
              View Details
            </Button>
          )}
        </div>
      ),
    },
  ];

  const tableData = mockJobs.map(job => ({
    ...job,
    serviceType: activeService === "Roll off Service" ? "Roll of Service" : "Commercial Service",
    status: activeService === "Roll off Service" ? job.status : "Waste Pickup"
  }));

  return (
    <Container className="py-8">
      <PageHeader title="Today All Jobs" className="mb-8" />

      <div className="bg-white border border-gray-100 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-none rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
            />
          </div>

          <div className="flex items-center p-1 bg-[#F8FAFC] border border-gray-100 gap-1">
            <button 
              onClick={() => setActiveService("Roll off Service")}
              className={`px-8 py-2.5 text-sm font-bold transition-all ${
                activeService === "Roll off Service" 
                  ? "bg-[#0265AF] text-white shadow-md" 
                  : "text-gray-500 hover:text-[#172C41]"
              }`}
            >
              Roll off Service
            </button>
            <button 
              onClick={() => setActiveService("Commercial Service")}
              className={`px-8 py-2.5 text-sm font-bold transition-all ${
                activeService === "Commercial Service" 
                  ? "bg-[#0265AF] text-white shadow-md" 
                  : "text-gray-500 hover:text-[#172C41]"
              }`}
            >
              Commercial Service
            </button>
          </div>
        </div>

        <DataTable columns={columns} data={tableData} className="border-none" />

        <CustomPagination 
          currentPage={currentPage}
          totalPages={4}
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