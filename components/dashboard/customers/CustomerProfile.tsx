"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Briefcase, TrendingUp, MoreVertical, Eye } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookingDetailsModal from "./BookingDetailsModal";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { useGetSingleCustomerQuery } from "@/redux/api/adminDashboard/customerApi";
import { format } from "date-fns";

export interface BookingHistory {
  id: string;
  orderId: string;
  serviceType: string;
  date: string;
  status: string;
  amount: number;
  raw: any; // Keep raw data for modal
}

interface CustomerProfileProps {
  id: string;
}

const CustomerProfile = ({ id }: CustomerProfileProps) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [activeServiceTab, setActiveServiceTab] = useState("All");
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: customerData, isLoading } = useGetSingleCustomerQuery(id);
    const customer = customerData?.data;

    const subscriptions = customer?.subscriptions || [];
    
    const historyData: BookingHistory[] = subscriptions.map((sub: any) => ({
        id: sub.id,
        orderId: `#${sub.id.slice(-6).toUpperCase()}`,
        serviceType: sub.plan?.category?.replace("_", " ").split(" ").map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ") || "N/A",
        date: format(new Date(sub.startDate), "dd MMMM, yyyy"),
        status: sub.status.charAt(0) + sub.status.slice(1).toLowerCase(),
        amount: sub.totalAmount,
        raw: sub
    }));

    const filteredHistory = historyData.filter((item) => {
        if (activeServiceTab === "All") return true;
        return item.serviceType === activeServiceTab;
    });

    const handleViewBooking = (booking: any) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const historyColumns: ColumnDef<BookingHistory>[] = [
      { header: "Order ID", accessorKey: "orderId" },
      { header: "Service Type", accessorKey: "serviceType" },
      { header: "Date", accessorKey: "date" },
      { 
        header: "Status", 
        cell: (item) => (
          <span className={cn(
            "px-4 py-1 text-[11px] font-bold tracking-tight rounded-none",
            item.status === "Active" ? "bg-green-50 text-[#22C55E]" : "bg-blue-50 text-[#0062FF]"
          )}>
            {item.status}
          </span>
        ) 
      },
      { header: "Amount", cell: (row) => <span>${row.amount.toLocaleString()}</span> },
      {
        header: "Action",
        cell: (row) => (
          <button 
            onClick={() => handleViewBooking(row.raw)}
            className="p-2 text-[#0164B0] hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        )
      }
    ];

    if (isLoading) return <div className="p-8 text-center font-sans">Loading...</div>;
    if (!customer) return <div className="p-8 text-center font-sans">Customer not found</div>;

    const totalSpent = subscriptions.reduce((acc: number, sub: any) => acc + (sub.totalAmount || 0), 0);

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
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
                <Image 
                  src={customer.image || "/driver_profile_avatar_1775316560340.png"}
                  alt={customer.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#172C41]">{customer.fullName}</h2>
              <div className="space-y-2 text-[15px] font-medium text-gray-500">
                <p>Phone : <span className="text-[#172C41]">{customer.phone || "N/A"}</span></p>
                <p>Email : <span className="text-[#172C41]">{customer.email}</span></p>
                <p>Joined on : <span className="text-[#172C41]">{format(new Date(customer.createdAt), "dd MMMM yyyy")}</span></p>
                <p>Address : <span className="text-[#172C41]">{customer.address || "N/A"}</span></p>
              </div>
              <span className={cn(
                "inline-block px-3 py-1 text-[11px] font-bold rounded-none mt-2",
                customer.status === "ACTIVE" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-red-50 text-red-600"
              )}>
                {customer.status.charAt(0) + customer.status.slice(1).toLowerCase()}
              </span>
            </div>
          </div>

          {/* Summary Stats Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30">
            <StatCard 
              label="Total Booking" 
              value={subscriptions.length.toString()} 
              icon={Briefcase} 
              iconBgColor="bg-red-50" 
              iconColor="text-red-600"
            />
            <StatCard 
              label="Total Order Amount" 
              value={`$${totalSpent.toLocaleString()}`} 
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
                    {["All", "Roll Off", "Commercial"].map((tab) => (
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

            <DataTable columns={historyColumns} data={filteredHistory} className="border-none" />

            <CustomPagination
                currentPage={currentPage}
                totalPages={1}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={setRowsPerPage}
                className="border-t border-gray-100"
            />
          </div>
        </div>

        <BookingDetailsModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            booking={selectedBooking}
        />
      </div>
    );
};

export default CustomerProfile;
