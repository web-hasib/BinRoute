"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ContactMessage {
  id: string;
  name: string;
  emailAddress: string;
  submittedDate: string;
  submittedTime: string;
  status: "Read" | "Unread";
}

const mockMessages: ContactMessage[] = Array(10).fill({
  id: "1",
  name: "Tomas Diko",
  emailAddress: "null@gmail.com",
  submittedDate: "21 Oct 2025",
  submittedTime: "10:20 AM",
  status: "Unread",
}).map((m, i) => ({ ...m, id: (i+1).toString(), status: i % 3 === 1 ? "Read" : "Unread", submittedDate: i % 3 === 1 ? "12 July 2025" : "21 Oct 2025" }));

const ContactUsList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns: ColumnDef<ContactMessage>[] = [
      { header: "Name", accessorKey: "name" },
      { header: "Email Address", accessorKey: "emailAddress" },
      { header: "Submitted Date", accessorKey: "submittedDate" },
      { header: "Submitted Time", accessorKey: "submittedTime" },
      { 
        header: "Status", 
        cell: (item) => (
          <span className={cn(
            "px-4 py-1 text-[11px] font-bold tracking-tight rounded-none inline-block min-w-[70px] text-center",
            item.status === "Unread" ? "bg-red-50 text-red-500" : "bg-green-50 text-[#22C55E]"
          )}>
            {item.status}
          </span>
        ) 
      },
      {
        header: "Action",
        cell: (item) => (
          <Link href={`/dashboard/contact-us/${item.id}`}>
            <Button 
              variant="primary"
              className="h-5!"
            >
                View Details
            </Button>
          </Link>
        )
      }
    ];

    return (
      <div className="space-y-6">
        <PageHeader title="Contact Us" />

        <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
              />
            </div>

            <Button 
                variant="outline"
                className="border-gray-100 text-gray-400 font-medium px-6 py-2 rounded-none flex items-center gap-2 h-10 hover:bg-gray-50"
            >
                <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>

          <DataTable columns={columns} data={mockMessages} className="border-none" />

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

export default ContactUsList;
