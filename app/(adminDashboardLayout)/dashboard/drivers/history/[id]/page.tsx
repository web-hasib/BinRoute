"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { ArrowLeft, Search, Briefcase, Calendar, CheckSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomPagination } from "@/components/ui/CustomPagination";

interface RecentActivity {
  orderId: string;
  customerName: { name: string; email: string };
  serviceType: string;
  location: string;
  amount: string;
  status: "Completed" | "Pending";
}

const recentActivities: RecentActivity[] = Array(10).fill({
  orderId: "#INV-88321",
  customerName: { name: "Tomas Diko", email: "@tomasdiko.com" },
  serviceType: "Commercial",
  location: "South Austin Residential",
  amount: "$245.00",
  status: "Completed",
});

const DriverHistoryPage = () => {
    const router = useRouter();
    const { id } = useParams() as { id: string };
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
        <Container className="py-8 bg-[#F8FAFC] min-h-screen">
          <div className="space-y-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Recent Activity
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </Container>
    );
};

export default DriverHistoryPage;
