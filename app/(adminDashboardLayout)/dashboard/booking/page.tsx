"use client";

import React from "react";
import Container from "@/components/ui/container";
import { Search, ChevronLeft, ChevronRight, Eye, Download } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";
import Link from "next/link";

interface Booking {
  id: string;
  customer: { name: string; email: string };
  service: string;
  amount: string;
  date: string;
  status: string;
}

const bookings: Booking[] = Array(10).fill({
  id: "INV-88321",
  customer: { name: "Tomas Diko", email: "@tomasdiko.com" },
  service: "Commercial Service",
  amount: "$245.00",
  date: "01 march 2026",
  status: "Paid",
});

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
    cell: (item) => <span className="font-bold text-[#1A1A1A]">{item.amount}</span>,
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Status",
    cell: (item) => (
      <span className="inline-flex items-center px-2 py-1 bg-[#E8F5E9] text-[#4CAF50] text-[10px] font-bold uppercase tracking-wider rounded-none">
        {item.status}
      </span>
    ),
  },
  {
    header: "Action",
    cell: (item) => (
      <div className="flex items-center justify-end gap-3">
        <Link href={`/dashboard/booking/${item.id}`} className="text-[#0062FF] hover:bg-blue-50 p-1 transition-colors">
          <Eye className="w-5 h-5" />
        </Link>
        <button className="text-[#0062FF] hover:bg-blue-50 p-1 transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>
    ),
  },
];

const BookingPage = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [activeService, setActiveService] = React.useState("Commercial Service");
  const totalPages = 4; // Mock total pages

  // Filter bookings based on active service (mock)
  const filteredBookings = bookings.map(b => ({ ...b, service: activeService }));

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#001D3D]">All Booking Service</h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-none overflow-hidden">
        {/* Search and Filters */}
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center bg-gray-50 p-1 rounded-none border border-gray-100">
            <button 
              onClick={() => setActiveService("Roll off Service")}
              className={`px-6 py-2 text-sm font-medium transition-all ${
                activeService === "Roll off Service" 
                  ? "bg-[#0062FF] text-white rounded-none shadow-sm" 
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              Roll off Service
            </button>
            <button 
              onClick={() => setActiveService("Commercial Service")}
              className={`px-6 py-2 text-sm font-medium transition-all ${
                activeService === "Commercial Service" 
                  ? "bg-[#0062FF] text-white rounded-none shadow-sm" 
                  : "text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              Commercial Service
            </button>
          </div>
        </div>

        {/* Table */}
        <DataTable columns={columns} data={filteredBookings} className="border-none" />

        {/* Footer / Pagination */}
        <CustomPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          className="border-t border-gray-100"
        />
      </div>
    </Container>
  );
};

export default BookingPage;