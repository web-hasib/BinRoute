"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart3, Search } from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import ReportDetailsModal from "@/components/dashboard/reports/ReportDetailsModal";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestType: "Reschedule Pickup" | "Report Damage" | "Missing schedule";
  status: "Pending" | "Completed";
  date: string;
  reason: string;
}

const dummyReports: Report[] = [
  {
    id: "LD-8829",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Pending",
    date: "21 May, 2026",
    reason: "Please place the dumpster on the left side of the driveway, away from the power lines.",
  },
  {
    id: "LD-8830",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Report Damage",
    status: "Pending",
    date: "21 May, 2026",
    reason: "Large dent on the front panel of the dumpster.",
  },
  {
    id: "LD-8831",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Missing schedule",
    status: "Pending",
    date: "21 May, 2026",
    reason: "Expected delivery was yesterday but no one showed up.",
  },
  {
    id: "LD-8832",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Pending",
    date: "21 May, 2026",
    reason: "Need to change pickup date due to ongoing construction work.",
  },
  {
    id: "LD-8833",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Completed",
    date: "21 May, 2026",
    reason: "Rescheduling for a more convenient time.",
  },
  {
    id: "LD-8834",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Completed",
    date: "21 May, 2026",
    reason: "Rescheduling for a more convenient time.",
  },
  {
    id: "LD-8835",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Completed",
    date: "21 May, 2026",
    reason: "Rescheduling for a more convenient time.",
  },
  {
    id: "LD-8836",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Completed",
    date: "21 May, 2026",
    reason: "Rescheduling for a more convenient time.",
  },
  {
    id: "LD-8837",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Completed",
    date: "21 May, 2026",
    reason: "Rescheduling for a more convenient time.",
  },
  {
    id: "LD-8838",
    customerName: "Tomas Diko",
    customerEmail: "tomas@diko.com",
    customerPhone: "+1 (555) 123-4567",
    requestType: "Reschedule Pickup",
    status: "Completed",
    date: "21 May, 2026",
    reason: "Rescheduling for a more convenient time.",
  },
];

interface ReportModalData extends Report {
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
}

const ReportsPage = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportModalData | null>(null);

  const tabs = ["All", "Reschedule Pickup", "Report Damage", "Missing schedule"];

  const filteredReports = dummyReports.filter((report) => 
    selectedTab === "All" || report.requestType === selectedTab
  );

  const handleViewDetails = (report: Report) => {
    // Enrich report data for modal
    setSelectedReport({
      ...report,
      currentSchedule: {
        category: "Commercial",
        dumpsterSize: "2 Yard Dumpster",
        day: "Monday",
        frequency: "1x Per Month",
      },
      newSchedule: report.requestType === "Reschedule Pickup" ? {
        category: "Commercial",
        dumpsterSize: "2 Yard Dumpster",
        day: "Monday",
        frequency: "1x Per Month",
      } : undefined,
      damageImage: report.requestType === "Report Damage" ? "/blog/hero_bg.png" : undefined,
      missingDate: report.requestType === "Missing schedule" ? "May 21, 2025" : undefined,
    });
    setIsModalOpen(true);
  };

  const columns: ColumnDef<Report>[] = [
    {
      header: "Reports ID",
      accessorKey: "id",
      cell: (row) => <span className="text-sm font-medium text-[#4B5563]">Rep#{row.id}</span>
    },
    {
      header: "Customer Name",
      cell: (row) => (
        <div className="py-1">
          <p className="text-sm font-bold text-[#0A2540]">{row.customerName}</p>
          <p className="text-xs text-gray-400">@{row.customerEmail}</p>
        </div>
      )
    },
    {
      header: "Request type",
      accessorKey: "requestType",
      cell: (row) => <span className="text-sm font-medium text-[#4B5563]">{row.requestType}</span>
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={cn(
          "px-3 py-1 text-xs font-bold rounded-none inline-block min-w-[70px] text-center",
          row.status === "Pending" ? "bg-[#F3F4F6] text-[#6B7280]" : "bg-[#DCFCE7] text-[#166534]"
        )}>
          {row.status}
        </span>
      )
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (row) => <span className="text-sm font-medium text-[#4B5563]">{row.date}</span>
    },
    {
      header: "Action",
      cell: (row) => (
        <Button 
          variant={"primary"} 
          size="sm" 
          onClick={() => handleViewDetails(row)}
          className="h-10 px-5 text-xs font-bold bg-[#0061AA] hover:bg-[#014e89] rounded-none transition-all shadow-sm"
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <Container className="space-y-8 pb-10">
      <PageHeader title="All Reports" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Reports" 
          value="300" 
          icon={BarChart3} 
          iconBgColor="bg-[#EAF6FF]" 
          iconColor="text-[#0061AA]" 
        />
        <StatCard 
          label="In progress" 
          value="50" 
          icon={BarChart3} 
          iconBgColor="bg-[#FFF4E5]" 
          iconColor="text-[#FF9500]" 
        />
        <StatCard 
          label="Completed" 
          value="20" 
          icon={BarChart3} 
          iconBgColor="bg-[#E6F9EE]" 
          iconColor="text-[#22C55E]" 
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
        {/* Search and Filters */}
        <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative w-full lg:max-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-11 pr-4 py-3 bg-[#F4F7F9] border-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0061AA] text-[#0A2540] placeholder:text-gray-400 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#F1F5F9] p-1 rounded-none border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  "px-5 py-2.5 text-sm font-bold transition-all",
                  selectedTab === tab 
                    ? "bg-white text-[#0A2540] shadow-sm ring-1 ring-black/5" 
                    : "text-[#64748B] hover:text-[#0A2540]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="p-0">
          <DataTable 
            columns={columns} 
            data={filteredReports} 
            className="border-none shadow-none"
          />
        </div>

        {/* Reusable Pagination */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          className="border-t border-gray-100"
        />
      </div>

      <ReportDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        report={selectedReport}
      />
    </Container>
  );
};

export default ReportsPage;