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
import { useGetAllReportsQuery, useGetAllReportStatsQuery } from "@/redux/api/adminDashboard/reportApi";
import { format } from "date-fns";

interface Report {
  id: string;
  reportId: string;
  type: string;
  status: string;
  reportDescription: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  subscription?: {
    dropoffAddress: string;
  };
  damagePicture?: string | null;
  missingScheduleDate?: string | null;
}

// Dummy data removed

interface ReportModalData {
  _id?: string;
  id: string; // Internal or display ID
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
}

const ReportsPage = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportModalData | null>(null);



  const [searchTerm, setSearchTerm] = useState("");

  const { data: reportsData, isLoading, error: reportsError } = useGetAllReportsQuery({
    page: currentPage,
    limit: rowsPerPage,
    ...(searchTerm && { searchTerm }),
  });

  const { data: statsData, error: statsError } = useGetAllReportStatsQuery({});

  if (reportsError) console.error("Reports API Error:", reportsError);
  if (statsError) console.error("Stats API Error:", statsError);

  const reports = reportsData?.data?.data || [];
  const meta = reportsData?.data?.meta || { total: 0, page: 1, limit: 10, totalPage: 1 };

  const tabs = ["All", "Report Damage", "Missing schedule"];

  const typeMap: Record<string, string> = {
    "RESCHEDULE_PICKUP": "Reschedule Pickup",
    "REPORT_DAMAGE": "Report Damage",
    "MISSING_SCHEDULE": "Missing schedule"
  };

  const filteredReports = reports.filter((report: Report) => 
    selectedTab === "All" || typeMap[report.type] === selectedTab
  );

  const handleViewDetails = (report: Report) => {
    // Map backend data to modal requirements
    setSelectedReport({
      _id: report.id, // Database ID for API actions
      id: report.id,
      reportId: report.reportId, // Display ID
      customerName: report.user.fullName,
      customerEmail: report.user.email,
      customerPhone: report.user.phone,
      requestType: typeMap[report.type] as "Reschedule Pickup" | "Report Damage" | "Missing schedule",
      status: report.status.charAt(0) + report.status.slice(1).toLowerCase(),
      date: format(new Date(report.createdAt), "dd MMM, yyyy"),
      reason: report.reportDescription,
      currentSchedule: {
        category: "Commercial",
        dumpsterSize: "2 Yard Dumpster",
        day: "Monday",
        frequency: "1x Per Month",
      },
      newSchedule: report.type === "RESCHEDULE_PICKUP" ? {
        category: "Commercial",
        dumpsterSize: "2 Yard Dumpster",
        day: "Monday",
        frequency: "1x Per Month",
      } : undefined,
      damageImage: report.damagePicture || undefined,
      missingDate: report.missingScheduleDate ? format(new Date(report.missingScheduleDate), "MMMM dd, yyyy") : undefined,
    } as ReportModalData);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<Report>[] = [
    {
      header: "Reports ID",
      accessorKey: "reportId",
      cell: (row) => <span className="text-sm font-medium text-[#4B5563]">{row.reportId}</span>
    },
    {
      header: "Customer Name",
      cell: (row) => (
        <div className="py-1">
          <p className="text-sm font-bold text-[#0A2540]">{row.user.fullName}</p>
          <p className="text-xs text-gray-400">@{row.user.email}</p>
        </div>
      )
    },
    {
      header: "Request type",
      accessorKey: "type",
      cell: (row) => <span className="text-sm font-medium text-[#4B5563]">{typeMap[row.type] || row.type}</span>
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={cn(
          "px-3 py-1 text-xs font-bold rounded-none inline-block min-w-[70px] text-center",
          row.status === "PENDING" && "bg-[#F3F4F6] text-[#6B7280]",
          row.status === "UNDER_REVIEW" && "bg-[#FFF4E5] text-[#FF9500]",
          row.status === "RESOLVED" && "bg-[#DCFCE7] text-[#166534]",
          row.status === "DISMISSED" && "bg-[#FEE2E2] text-[#991B1B]"
        )}>
          {row.status.replace("_", " ").split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")}
        </span>
      )
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row) => <span className="text-sm font-medium text-[#4B5563]">{format(new Date(row.createdAt), "dd MMM, yyyy")}</span>
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
          value={statsData?.data?.total?.toString() || "0"} 
          icon={BarChart3} 
          iconBgColor="bg-[#EAF6FF]" 
          iconColor="text-[#0061AA]" 
        />
        <StatCard 
          label="In progress" 
          value={statsData?.data?.pending?.toString() || "0"} 
          icon={BarChart3} 
          iconBgColor="bg-[#FFF4E5]" 
          iconColor="text-[#FF9500]" 
        />
        <StatCard 
          label="Resolved" 
          value={statsData?.data?.resolved?.toString() || "0"} 
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          totalPages={meta.totalPage}
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