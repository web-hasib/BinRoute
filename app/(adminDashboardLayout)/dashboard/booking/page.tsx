"use client";

import React from "react";
import Container from "@/components/ui/container";
import { Search, ChevronLeft, ChevronRight, Eye, Download, Plus, TrendingUp, Users, UserCheck, Briefcase } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/booking/details/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { useGetAllBookingsQuery, IBooking } from "@/redux/api/adminDashboard/bookingApi";
import { useGetDashboardStatsQuery } from "@/redux/api/adminDashboard/analysisApi";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [activeService, setActiveService] = React.useState("COMMERCIAL");
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: bookingData, isLoading, isError } = useGetAllBookingsQuery({
    page: currentPage,
    limit: rowsPerPage,
    seachTerm: debouncedSearchTerm,
    category: activeService === "All" ? undefined : activeService,
  });

  const { data: dashboardStats, isLoading: isStatsLoading } = useGetDashboardStatsQuery({ period: "weekly" });

  const stats = dashboardStats?.data || {
    totalRevenue: 0,
    totalCustomers: 0,
    totalDrivers: 0,
    activeWork: 0
  };

  const bookings = bookingData?.data?.data || [];
  const meta = bookingData?.data?.meta;

  const columns: ColumnDef<IBooking>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: (item) => <span className="font-bold text-[#1A1A1A]">#{item.id.slice(-6).toUpperCase()}</span>,
    },
    {
      header: "Customer Name",
      cell: (item) => (
        <div>
          <p className="font-bold text-[#1A1A1A]">{item.user?.fullName || "N/A"}</p>
          <p className="text-xs text-[#999999] font-medium">{item.user?.email || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Service Type",
      cell: (item) => (
        <span className="font-medium text-gray-600">
            {item.plan?.category?.replace("_", " ").toLowerCase().split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "N/A"}
        </span>
      )
    },
    {
      header: "Amount",
      cell: (item) => <span className="font-bold text-[#1A1A1A]">${item.totalAmount}</span>,
    },
    {
      header: "Date",
      cell: (item) => <span className="text-[#666666]">{format(new Date(item.createdAt), "dd MMM yyyy")}</span>,
    },
    {
      header: "Status",
      cell: (item) => (
        <span className={cn(
            "inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none",
            item.status === "ACTIVE" ? "bg-[#E8F5E9] text-[#4CAF50]" : "bg-red-50 text-red-500"
        )}>
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

  return (
    <Container>
      <PageHeader title="All Booking Service" />

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
        <StatCard 
          label="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          iconBgColor="bg-green-50" 
          iconColor="text-green-600"
          isLoading={isStatsLoading}
        />
        <StatCard 
          label="Total Customer" 
          value={stats.totalCustomers.toString()} 
          icon={Users} 
          iconBgColor="bg-blue-50" 
          iconColor="text-blue-600"
          isLoading={isStatsLoading}
        />
        <StatCard 
          label="Total Driver" 
          value={stats.totalDrivers.toString()} 
          icon={UserCheck} 
          iconBgColor="bg-purple-50" 
          iconColor="text-purple-600"
          isLoading={isStatsLoading}
        />
        <StatCard 
          label="Active Work" 
          value={stats.activeWork.toString()} 
          icon={Briefcase} 
          iconBgColor="bg-red-50" 
          iconColor="text-red-600"
          isLoading={isStatsLoading}
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
        {/* Search and Filters */}
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0062FF]"
            />
          </div>

          <div className="flex items-center bg-gray-50 p-1 rounded-none border border-gray-100">
            {["ROLL_OFF", "COMMERCIAL"].map((category) => (
                <button 
                  key={category}
                  onClick={() => setActiveService(category)}
                  className={`px-6 py-2 text-sm font-bold transition-all ${
                    activeService === category 
                      ? "bg-[#0062FF] text-white rounded-none shadow-sm" 
                      : "text-[#666666] hover:text-[#1A1A1A]"
                  }`}
                >
                  {category.replace("_", " ").toLowerCase().split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Service
                </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <DataTable columns={columns} data={bookings} isLoading={isLoading} className="border-none" />

        {/* Footer / Pagination */}
        <CustomPagination 
          currentPage={currentPage}
          totalPages={meta?.totalPages || 1}
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