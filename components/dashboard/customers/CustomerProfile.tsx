"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Briefcase, TrendingUp, MoreVertical } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomPagination } from "@/components/ui/CustomPagination";

export interface BookingHistory {
  orderId: string;
  serviceType: string;
  date: string;
  status: "Ongoing" | "Completed";
  amount: string;
}

const historyData: BookingHistory[] = [
  { orderId: "#123456", serviceType: "Commercial", date: "15 March, 2025", status: "Ongoing", amount: "$2,300.00" },
  { orderId: "#123456", serviceType: "Commercial", date: "15 March, 2025", status: "Ongoing", amount: "$2,300.00" },
  { orderId: "#123456", serviceType: "Roll-off", date: "15 March, 2025", status: "Completed", amount: "$2,300.00" },
];

interface CustomerProfileProps {
  id: string;
}

const CustomerProfile = ({ id }: CustomerProfileProps) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [activeServiceTab, setActiveServiceTab] = useState("All");

    const historyColumns: ColumnDef<BookingHistory>[] = [
      { header: "Order ID", accessorKey: "orderId" },
      { header: "Service Type", accessorKey: "serviceType" },
      { header: "Date", accessorKey: "date" },
      { 
        header: "Status", 
        cell: (item) => (
          <span className={cn(
            "px-4 py-1 text-[11px] font-bold tracking-tight rounded-none",
            item.status === "Ongoing" ? "bg-blue-50 text-[#0062FF]" : "bg-green-50 text-[#22C55E]"
          )}>
            {item.status}
          </span>
        ) 
      },
      { header: "Amount", accessorKey: "amount" },
      {
        header: "Action",
        cell: () => (
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
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
          Customers Profile
        </button>

        <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none pb-8">
          {/* Header Cover */}
          <div className="relative h-48 w-full bg-linear-to-r from-gray-200 to-gray-300">
            <Image 
              src="/dummy.png"
              alt="Profile Cover"
              fill
              className="object-cover opacity-50"
            />
          </div>

          {/* Profile Basic Info */}
          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end -mt-16 mb-8 relative z-10 w-full">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <Image 
                  src="/driver_profile_avatar_1775316560340.png"
                  alt="Tomas Diko"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#172C41]">Tomas Diko</h2>
              <div className="space-y-2 text-[15px] font-medium text-gray-500">
                <p>Phone : <span className="text-[#172C41]">888 012 145</span></p>
                <p>Email : <span className="text-[#172C41]">null@gmail.com</span></p>
                <p>Joined on : <span className="text-[#172C41]">01 March 2026</span></p>
                <p>Address : <span className="text-[#172C41]">450 Industrial Way, North Portland</span></p>
              </div>
              <span className="inline-block px-3 py-1 bg-[#F0FDF4] text-[#22C55E] text-[11px] font-bold rounded-none mt-2">Active</span>
            </div>
          </div>

          {/* Summary Stats Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30">
            <StatCard 
              label="Total Booking" 
              value="1200" 
              icon={Briefcase} 
              iconBgColor="bg-red-50" 
              iconColor="text-red-600"
            />
            <StatCard 
              label="Total Order Amount" 
              value="$1,220.00" 
              icon={TrendingUp} 
              iconBgColor="bg-green-50" 
              iconColor="text-green-600"
            />
          </div>

          {/* Booking History Section */}
          <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-[#172C41]">Booking History</h3>
                <div className="flex items-center bg-[#F8FAFC] border border-gray-100 p-1 rounded-none">
                    {["All", "Roll-Off", "Commercial Service"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveServiceTab(tab)}
                            className={cn(
                                "px-6 py-2 text-sm font-bold transition-all",
                                activeServiceTab === tab ? "bg-[#0164B0] text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <DataTable columns={historyColumns} data={historyData} className="border-none" />

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
    );
};

export default CustomerProfile;
