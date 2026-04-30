"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { ArrowLeft, Search, Briefcase, Calendar, CheckSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { useGetDriverByIdQuery, useGetStatByDriverIdQuery, IAssignedJob, useGetDriverAssignedJobsQuery } from "@/redux/api/adminDashboard/driverApi";

const DriverHistoryPage = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: statsData, isLoading: isStatsLoading } = useGetStatByDriverIdQuery(id);
  const { data: jobsData, isLoading: isJobsLoading } = useGetDriverAssignedJobsQuery({
    id,
    page: currentPage,
    limit: rowsPerPage
  });

  const stats = statsData?.data;
  const jobs = jobsData?.data.data || [];
  const meta = jobsData?.data.meta;

  const activityColumns: ColumnDef<any>[] = [
    {
      header: "Job Code",
      accessorKey: "jobCode",
      cell: (activity) => <span className="font-bold text-[#172C41]">{activity.jobCode}</span>
    },
    {
      header: "Customer Name",
      cell: (activity) => (
        <div>
          <p className="font-bold text-[#172C41]">{activity.subscription?.user?.fullName || "N/A"}</p>
          <p className="text-xs text-gray-400 font-medium">{activity.subscription?.user?.email || "N/A"}</p>
        </div>
      )
    },
    {
      header: "Service Type",
      cell: (activity) => (
        <span className="font-medium text-gray-600">
          {activity.subscription?.plan?.category?.replace("_", " ").toLowerCase().split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "N/A"}
        </span>
      )
    },
    {
      header: "Status",
      cell: (activity) => (
        <span className={cn(
          "px-4 py-1 text-[11px] font-bold tracking-tight rounded-none uppercase",
          activity.status === "PENDING" ? "bg-orange-50 text-orange-500" :
            activity.status === "COMPLETED" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-blue-50 text-blue-500"
        )}>
          {activity.status.replace("_", " ")}
        </span>
      )
    }
  ];

  if (isJobsLoading) return <div className="p-8 text-center font-sans">Loading...</div>;

  return (
    <Container className="py-8 bg-[#F8FAFC] min-h-screen">
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Assigned Jobs
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            label="Total Completed"
            value={stats?.totalCompletedJobs.toString() || "0"}
            icon={Briefcase}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="This Month"
            value={stats?.thisMonthCompletedJobs.toString() || "0"}
            icon={Calendar}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="Today's Job"
            value={stats?.todayTotalJobs.toString() || "0"}
            icon={Clock}
            iconBgColor="bg-orange-50"
            iconColor="text-orange-600"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="Completed Today"
            value={stats?.todayCompletedJobs.toString() || "0"}
            icon={CheckSquare}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="Pending Jobs"
            value={stats?.pendingJobs.toString() || "0"}
            icon={Clock}
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="In Progress"
            value={stats?.inProgressJobs.toString() || "0"}
            icon={Briefcase}
            iconBgColor="bg-yellow-50"
            iconColor="text-yellow-600"
            isLoading={isStatsLoading}
          />
        </div>

        <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-none rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
              />
            </div>
          </div>

          <DataTable columns={activityColumns} data={jobs} className="border-none" />

          <CustomPagination
            currentPage={currentPage}
            totalPages={meta?.totalPage || 1}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            className="border-t border-gray-100"
          />
        </div>
      </div>
    </Container>
  );
};

export default DriverHistoryPage;
