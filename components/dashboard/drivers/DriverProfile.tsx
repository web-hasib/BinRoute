"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Edit, Briefcase, Calendar, CheckSquare, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomPagination } from "@/components/ui/CustomPagination";

export interface RecentActivity {
  orderId: string;
  customerName: { name: string; email: string };
  serviceType: string;
  location: string;
  amount: string;
  status: "Completed" | "Pending";
}

const recentActivities: RecentActivity[] = Array(5).fill({
  orderId: "#INV-88321",
  customerName: { name: "Tomas Diko", email: "@tomasdiko.com" },
  serviceType: "Commercial",
  location: "South Austin Residential",
  amount: "$245.00",
  status: "Completed",
});

interface DriverProfileProps {
    id: string;
}

const DriverProfile = ({ id }: DriverProfileProps) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const activityColumns: ColumnDef<RecentActivity>[] = [
      { header: "Order ID", accessorKey: "orderId" },
      { 
        header: "Customer Name", 
        cell: (activity) => (
          <div>
            <p className="font-bold text-[#172C41]">{activity.customerName.name}</p>
            <p className="text-xs text-gray-400 font-medium">{activity.customerName.email}</p>
          </div>
        ) 
      },
      { header: "Service Type", accessorKey: "serviceType" },
      { header: "Location", accessorKey: "location" },
      { header: "Amount", accessorKey: "amount" },
      { 
        header: "Status", 
        cell: (activity) => (
          <span className={cn(
            "px-4 py-1 text-[11px] font-bold tracking-tight rounded-none",
            activity.status === "Completed" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-red-50 text-red-500"
          )}>
            {activity.status}
          </span>
        ) 
      }
    ];

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
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <Image 
                  src="/driver_profile_avatar_1775316560340.png"
                  alt="Tomas Diko"
                  fill
                  className="object-cover"
                />
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
              <h2 className="text-2xl font-extrabold text-[#172C41]">Tomas Diko</h2>
              <div className="space-y-2 text-[15px] font-medium text-gray-500">
                <p>Phone : <span className="text-[#172C41]">888 012 145</span></p>
                <p>Email : <span className="text-[#172C41]">null@gmail.com</span></p>
                <p>Joined on : <span className="text-[#172C41]">01 march 2026</span></p>
                <p>Address : <span className="text-[#172C41]">450 Industrial Way, North Portland</span></p>
              </div>
              <span className="inline-block px-3 py-1 bg-[#F0FDF4] text-[#22C55E] text-[11px] font-bold rounded-none">Active</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50/30">
            <StatCard 
              label="Total Completed Job" 
              value="1200" 
              icon={Briefcase} 
              iconBgColor="bg-blue-50" 
              iconColor="text-blue-600"
            />
            <StatCard 
              label="This Month's Completed jobs" 
              value="65" 
              icon={Calendar} 
              iconBgColor="bg-purple-50" 
              iconColor="text-purple-600"
            />
            <StatCard 
              label="Today's Job" 
              value="8" 
              icon={Clock} 
              iconBgColor="bg-orange-50" 
              iconColor="text-orange-600"
            />
            <StatCard 
              label="Completed Today" 
              value="3" 
              icon={CheckSquare} 
              iconBgColor="bg-green-50" 
              iconColor="text-green-600"
            />
          </div>

          {/* Recent Activity */}
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#172C41]">Recent Activity</h3>
              <Link href={`/dashboard/drivers/history/${id}`} className="text-[#0265AF] text-sm font-bold border-b border-transparent hover:border-[#0265AF]">
                 View Full History
              </Link>
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

                    <div className="flex items-center p-1 bg-[#F8FAFC] border border-gray-100 gap-1 rounded-none">
                        <button className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Roll off Service</button>
                        <button className="px-6 py-2 text-sm font-bold bg-[#0265AF] text-white shadow-sm rounded-none">Commercial Service</button>
                    </div>
                </div>

                <DataTable columns={activityColumns} data={recentActivities} className="border-none" />

                <CustomPagination
                  currentPage={currentPage}
                  totalPages={4}
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
