"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import { Search, Eye, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetAllDriversQuery, IDriver } from "@/redux/api/adminDashboard/driverApi";
import { format } from "date-fns";

const DriverList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data: driversData, isLoading } = useGetAllDriversQuery({
        page: currentPage,
        limit: rowsPerPage,
        searchTerm,
        driverStatus: activeFilter === "All" ? undefined : activeFilter.toUpperCase()
    });

    const drivers = driversData?.data.data || [];
    const meta = driversData?.data.meta;

    const columns: ColumnDef<IDriver>[] = [
      { header: "Driver Name", accessorKey: "fullName" },
      { header: "Phone Number", accessorKey: "phone" },
      { header: "Email Address", accessorKey: "email" },
      { header: "Completed Task", accessorKey: "totalCompletedJobs" },
      { 
        header: "Added On", 
        cell: (driver) => format(new Date(driver.createdAt), "dd MMM yyyy")
      },
      { 
        header: "Status", 
        cell: (driver) => (
          <span className={cn(
            "px-3 py-1 text-[11px] font-bold tracking-tight rounded-none uppercase",
            driver.driverStatus === "ONLINE" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-red-50 text-red-500"
          )}>
            {driver.driverStatus}
          </span>
        ) 
      },
      {
        header: "Action",
        cell: (driver) => (
          <div className="flex items-center gap-2">
            <Link 
              href={`/dashboard/drivers/${driver.id}`}
              className="p-2 text-[#0265AF] hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link 
              href={`/dashboard/drivers/edit/${driver.id}`}
              className="p-2 text-[#0265AF] hover:bg-blue-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Link>
          </div>
        )
      }
    ];

    return (
      <div className="space-y-6">
        <PageHeader title="Driver List" />
        <div className="bg-white border border-gray-100 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-none">
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center p-1 bg-[#F8FAFC] border border-gray-100 rounded-none">
                {["All", "Online", "In route", "Offline"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-6 py-2 text-sm font-bold transition-all",
                      activeFilter === filter ? "bg-white text-[#172C41] shadow-sm rounded-none" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <Link href="/dashboard/drivers/add">
                <Button 
                    variant={"primary"}
                    className="h-10"
                >
                    <span className="text-xl">+</span> Add New Driver
                </Button>
              </Link>
            </div>
          </div>

          <DataTable 
            columns={columns} 
            data={drivers} 
            isLoading={isLoading}
            className="border-none" 
          />

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
    );
};

export default DriverList;
