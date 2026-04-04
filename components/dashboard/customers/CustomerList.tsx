"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import { Search, Eye, Filter, Users, Briefcase, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  totalBooking: number;
  totalSpent: string;
}

const mockCustomers: Customer[] = Array(10).fill({
  id: "1",
  name: "Tomas Diko",
  phoneNumber: "888 012 145",
  emailAddress: "null@gmail.com",
  totalBooking: 12,
  totalSpent: "$2,300.00",
});

const CustomerList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Filter");

    const filterOptions = [
      "New Clients",
      "Old Clients",
      "Roll-off",
      "Commercial",
      "Driver Assigned",
      "Awaiting Driver",
    ];

    const handleFilterSelect = (option: string) => {
      setSelectedFilter(option);
      setIsFilterOpen(false);
    };

    const columns: ColumnDef<Customer>[] = [
      { header: "Customer Name", accessorKey: "name" },
      { header: "Phone Number", accessorKey: "phoneNumber" },
      { header: "Email Address", accessorKey: "emailAddress" },
      { header: "Total Booking", accessorKey: "totalBooking" },
      { header: "Total Spent", accessorKey: "totalSpent" },
      {
        header: "Action",
        cell: (customer) => (
          <div className="flex items-center gap-2">
            <Link 
              href={`/dashboard/customers/${customer.id}`}
              className="p-2 text-[#0265AF] hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        )
      }
    ];

    return (
      <div className="space-y-6">
        <PageHeader title="Customer List" />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              label="Total Customer" 
              value="1200" 
              icon={Users} 
              iconBgColor="bg-blue-50" 
              iconColor="text-blue-600"
            />
            <StatCard 
              label="Active Work" 
              value="20" 
              icon={Briefcase} 
              iconBgColor="bg-red-50" 
              iconColor="text-red-600"
            />
            <StatCard 
              label="Total Revenue" 
              value="$12,3620" 
              icon={TrendingUp} 
              iconBgColor="bg-green-50" 
              iconColor="text-green-600"
            />
        </div>

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

            <div className="relative">
              <Button 
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="border-gray-100 text-gray-400 font-medium px-6 py-2 rounded-none flex items-center gap-2 h-10 hover:bg-gray-50 bg-white"
              >
                  <Filter className="w-4 h-4" /> {selectedFilter}
              </Button>

              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl z-20 overflow-hidden rounded-none animate-in fade-in slide-in-from-top-2 duration-200">
                    {filterOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterSelect(option)}
                        className={cn(
                          "w-full text-left px-6 py-3 text-sm text-[#4A5568] hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 font-medium",
                          selectedFilter === option && "text-[#0265AF] bg-blue-50/30"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <DataTable columns={columns} data={mockCustomers} className="border-none" />

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

export default CustomerList;
