"use client";

import React from "react";
import Link from "next/link";
import { Eye, Download } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { useGetAllBookingsQuery, IBooking } from "@/redux/api/adminDashboard/bookingApi";
import { format } from "date-fns";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  amount: number;
  date: string;
  status: string;
}

const columns: ColumnDef<Booking>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
    cell: (item) => <span className="font-medium">#{item.id.slice(-6).toUpperCase()}</span>,
  },
  {
    header: "Customer Name",
    cell: (item) => (
      <div>
        <p className="font-bold text-[#1A1A1A]">{item.customerName}</p>
        <p className="text-xs text-[#999999] font-medium">{item.customerEmail}</p>
      </div>
    ),
  },
  {
    header: "Service Type",
    accessorKey: "service",
  },
  {
    header: "Amount",
    cell: (item) => <span className="font-bold">${item.amount.toLocaleString()}</span>,
  },
  {
    header: "Date",
    cell: (item) => <span className="text-[#666666]">{item.date}</span>,
  },
  {
    header: "Status",
    cell: (item) => (
      <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none ${
        item.status === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
      }`}>
        {item.status}
      </span>
    ),
  },
  {
    header: "Action",
    cell: (item) => (
      <div className="flex items-center justify-end">
        <Link href={`/dashboard/booking/${item.id}`} className="text-[#0062FF] hover:bg-blue-50 p-1 transition-colors">
          <Eye className="w-5 h-5" />
        </Link>
      </div>
    ),
  },
];

export const RecentBookingTable = () => {
  const { data: bookingData, isLoading } = useGetAllBookingsQuery({ limit: 3 });

  const bookings: Booking[] = (bookingData?.data?.data || []).map((sub: IBooking) => ({
    id: sub.id,
    customerName: sub.user?.fullName || `${sub.firstName} ${sub.lastName}`,
    customerEmail: sub.user?.email || sub.email,
    service: sub.plan?.category?.replace("_", " ").split(" ").map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ") || "N/A",
    amount: sub.totalAmount,
    date: format(new Date(sub.createdAt), "dd MMM yyyy"),
    status: sub.status,
  }));

  return (
    <div className="bg-white border border-gray-100 rounded-none overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white">
        <h3 className="text-lg font-bold text-[#1A1A1A]">Recent Booking Service</h3>
        <Link href="/dashboard/booking" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </Link>
      </div>
      <DataTable columns={columns} data={bookings} isLoading={isLoading} className="border-none" />
    </div>
  );
};
