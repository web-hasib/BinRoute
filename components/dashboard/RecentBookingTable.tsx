"use client";

import Link from "next/link";
import { Eye, Download } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

interface Booking {
  id: string;
  customer: { name: string; email: string };
  service: string;
  amount: string;
  date: string;
  status: string;
}

const bookings: Booking[] = [
  {
    id: "#INV-88321",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    service: "Roll of Service",
    amount: "$245.00",
    date: "01 march 2026",
    status: "Paid",
  },
  {
    id: "#INV-88321",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    service: "Roll of Service",
    amount: "$245.00",
    date: "01 march 2026",
    status: "Paid",
  },
  {
    id: "#INV-88321",
    customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
    service: "Commercial Service",
    amount: "$245.00",
    date: "01 march 2026",
    status: "Paid",
  },
];

const columns: ColumnDef<Booking>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
  },
  {
    header: "Customer Name",
    cell: (item) => (
      <div>
        <p className="font-bold text-[#1A1A1A]">{item.customer.name}</p>
        <p className="text-xs text-[#999999] font-medium">{item.customer.email}</p>
      </div>
    ),
  },
  {
    header: "Service Type",
    accessorKey: "service",
  },
  {
    header: "Amount",
    cell: (item) => <span className="font-bold">{item.amount}</span>,
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Status",
    cell: (item) => (
      <span className="inline-flex items-center px-2 py-1 bg-[#E8F5E9] text-[#4CAF50] text-[10px] font-bold uppercase tracking-wider">
        {item.status}
      </span>
    ),
  },
  {
    header: "Action",
    cell: () => (
      <div className="flex items-center justify-end gap-3">
        <button className="text-[#0062FF] hover:bg-blue-50 p-1 transition-colors">
          <Eye className="w-5 h-5" />
        </button>
        <button className="text-[#0062FF] hover:bg-blue-50 p-1 transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>
    ),
  },
];

export const RecentBookingTable = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-none overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white">
        <h3 className="text-lg font-bold text-[#1A1A1A]">Recent Booking Service</h3>
        <Link href="/bookings" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </Link>
      </div>
      <DataTable columns={columns} data={bookings} className="border-none" />
    </div>
  );
};
