"use client";

import React, { useState, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useGetAllContactsQuery,
  IContactMessage,
} from "@/redux/api/contact/contactApi";

type ReadFilter = "" | "true" | "false";

const ContactUsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("");

  const { data, isLoading, isFetching, refetch } = useGetAllContactsQuery({
    page: currentPage,
    limit: rowsPerPage,
    searchTerm: searchTerm || undefined,
    isRead: readFilter !== "" ? readFilter : undefined,
  });

  const messages = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / rowsPerPage) : 1;

  console.log(messages);

  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFilterChange = (value: ReadFilter) => {
    setReadFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnDef<IContactMessage>[] = [
    {
      header: "Name",
      cell: (item) => (
        <span className={cn("font-medium", !item.isRead && "font-bold text-[#1a1a1a]")}>
          {item.name}
        </span>
      ),
    },
    { header: "Email Address", accessorKey: "email" },
    {
      header: "Subject", cell: (item) => (
        <span className="max-w-[200px] truncate block">{item.subject}</span>
      )
    },
    {
      header: "Submitted Date",
      cell: (item) => <span>{formatDate(item.createdAt)}</span>,
    },
    {
      header: "Submitted Time",
      cell: (item) => <span>{formatTime(item.createdAt)}</span>,
    },
    {
      header: "Status",
      cell: (item) => (
        <span
          className={cn(
            "px-4 py-1 text-[11px] font-bold tracking-tight rounded-none inline-block min-w-[70px] text-center",
            item.isRead
              ? "bg-green-50 text-[#22C55E]"
              : "bg-red-50 text-red-500"
          )}
        >
          {item.isRead ? "Read" : "Unread"}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (item) => (
        <Link href={`/dashboard/contact-us/${item.id}`}>
          <Button variant="primary" className="h-8 text-xs px-4">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Us" />

      <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
        {/* Toolbar */}
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100">
          {/* Search */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by name or email..."
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              className="h-[46px] px-5 rounded-none"
            >
              Search
            </Button>
          </div>

          {/* Filter + Refresh */}
          <div className="flex items-center gap-3">
            {/* Read Status Filter */}
            <div className="flex items-center gap-1 border border-gray-100 rounded-none overflow-hidden">
              {(
                [
                  { label: "All", value: "" },
                  { label: "Unread", value: "false" },
                  { label: "Read", value: "true" },
                ] as { label: string; value: ReadFilter }[]
              ).map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(value)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    readFilter === value
                      ? "bg-[#0062AA] text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="p-2 border border-gray-100 text-gray-400 hover:text-[#0062AA] hover:border-[#0062AA] transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading overlay */}
        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading contacts...</span>
          </div>
        )}

        {!isLoading && !isFetching && (
          <>
            {/* Total count badge */}
            <div className="px-6 py-3 border-b border-gray-50 flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">
                Total:{" "}
                <span className="text-[#0062AA] font-bold">
                  {meta?.total ?? 0}
                </span>{" "}
                messages
              </span>
              {readFilter === "false" && (
                <span className="ml-2 px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-none">
                  Unread filter active
                </span>
              )}
              {readFilter === "true" && (
                <span className="ml-2 px-2 py-0.5 bg-green-50 text-[#22C55E] text-[10px] font-bold rounded-none">
                  Read filter active
                </span>
              )}
            </div>

            <DataTable columns={columns} data={messages} className="border-none" />
          </>
        )}

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          className="border-t border-gray-100"
        />
      </div>
    </div>
  );
};

export default ContactUsList;
