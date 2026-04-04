"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import { Search, Eye, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  completedTask: number;
  addedOn: string;
  status: "Online" | "Off-Line" | "In route" | "Offline";
  address: string;
}

const mockDrivers: Driver[] = Array(10).fill({
  id: "1",
  name: "Tomas Diko",
  phoneNumber: "888 012 145",
  emailAddress: "null@gmail.com",
  completedTask: 30,
  addedOn: "01 march 2026",
  status: "Online",
  address: "450 Industrial Way, North Portland",
});

const DriverList = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns: ColumnDef<Driver>[] = [
      { header: "Driver Name", accessorKey: "name" },
      { header: "Phone Number", accessorKey: "phoneNumber" },
      { header: "Email Address", accessorKey: "emailAddress" },
      { header: "Completed Task", accessorKey: "completedTask" },
      { header: "Added On", accessorKey: "addedOn" },
      { 
        header: "Status", 
        cell: (driver) => (
          <span className={cn(
            "px-3 py-1 text-[11px] font-bold tracking-tight rounded-none",
            driver.status === "Online" ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-[#F8FAFC] text-gray-400"
          )}>
            {driver.status}
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

          <DataTable columns={columns} data={mockDrivers} className="border-none" />

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
    );
};

export default DriverList;
