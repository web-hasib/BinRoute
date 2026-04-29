"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Edit, Briefcase, Calendar, CheckSquare, Clock, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { useGetDriverByIdQuery, useGetStatByDriverIdQuery, IAssignedJob, useGetDriverAssignedJobsQuery } from "@/redux/api/adminDashboard/driverApi";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface DriverProfileProps {
  id: string;
}

const DriverProfile = ({ id }: DriverProfileProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: driverData, isLoading: isDriverLoading } = useGetDriverByIdQuery(id);
  const { data: statsData, isLoading: isStatsLoading } = useGetStatByDriverIdQuery(id);
  const { data: jobsData, isLoading: isJobsLoading } = useGetDriverAssignedJobsQuery({
    id,
    page: currentPage,
    limit: rowsPerPage
  });

  const driver = driverData?.data;
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

  if (!driver && !isDriverLoading) return <div className="p-8 text-center font-sans">Driver not found</div>;

  return (
    <div className="space-y-6 pb-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Drivers Profile
      </button>

      <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
        {/* Header Image */}
        <div className="relative h-48 w-full bg-linear-to-r from-gray-200 to-gray-300">
          <Image
            src="/dummy.png"
            alt="Profile Cover"
            fill
            className="object-cover opacity-50"
          />
        </div>

        {/* Profile Details */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-8 relative z-10">
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
              {driver?.image || isDriverLoading ? (
                 <Image
                    src={driver?.image || "/driver_profile_avatar_1775316560340.png"}
                    alt={driver?.fullName || "Driver"}
                    fill
                    className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>
            <Link href={`/dashboard/drivers/edit/${id}`}>
              <Button
                className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white font-bold px-6 py-2.5 rounded-none flex items-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit Details
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-[#172C41]">
                {isDriverLoading ? <Skeleton className="h-8 w-48" /> : driver?.fullName}
            </h2>
            <div className="space-y-2 text-[15px] font-medium text-gray-500">
              <p>Phone : <span className="text-[#172C41]">{isDriverLoading ? <Skeleton className="h-4 w-32 inline-block" /> : driver?.phone}</span></p>
              <p>Email : <span className="text-[#172C41]">{isDriverLoading ? <Skeleton className="h-4 w-40 inline-block" /> : driver?.email}</span></p>
              <p>Joined on : <span className="text-[#172C41]">{driver?.createdAt ? format(new Date(driver.createdAt), "dd MMMM yyyy") : isDriverLoading ? <Skeleton className="h-4 w-36 inline-block" /> : "N/A"}</span></p>
              <p>Address : <span className="text-[#172C41]">{isDriverLoading ? <Skeleton className="h-4 w-60 inline-block" /> : driver?.address}</span></p>
            </div>
            {isDriverLoading ? (
                <Skeleton className="h-6 w-20" />
            ) : (
                <span className={cn(
                    "inline-block px-3 py-1 text-[11px] font-bold rounded-none uppercase",
                    driver?.status === "ACTIVE" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-red-50 text-red-500"
                )}>
                    {driver?.status}
                </span>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 bg-gray-50/30">
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

        {/* Recent Activity */}
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#172C41]">Assigned Jobs</h3>
            <Link href={`/dashboard/drivers/history/${id}`} className="text-[#0265AF] text-sm font-bold border-b border-transparent hover:border-[#0265AF]">
              View Full History
            </Link>
          </div>

          <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
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
      </div>
    </div>
  );
};

export default DriverProfile;
