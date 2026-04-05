"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  className?: string;
}

export const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  className,
}: CustomPaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 py-4 px-6 bg-white shrink-0",
        className,
      )}
    >
      {/* Left: Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#666666]">Rows per page</span>
        <div className="relative">
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-200 text-[#1A1A1A] text-sm rounded-none pl-3 pr-8 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
          >
            {[10, 20, 50, 100].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className=" cursor-pointer px-3 py-2 text-sm font-medium disabled:cursor-not-allowed text-black bg-background border border-gray-500 hover:text-gray-500 hover:border-gray-500 hover:bg-gray-100 disabled:opacity-30 rounded-none transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          {pages.map((page) => {
            if (totalPages > 5) {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-600 transition-all",
                      currentPage === page
                        ? "bg-[#0062AA] text-white border-[#0062AA]"
                        : "text-[#666666] hover:bg-gray-50 border-gray-200",
                    )}
                  >

                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="w-10 h-10 flex items-center justify-center text-[#666666] border border-gray-200 bg-white">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center text-sm font-bold border border-gray-200 transition-all",
                  currentPage === page
                    ? "bg-[#0062AA] text-white border-[#0062AA]"
                    : "text-[#666666] hover:bg-gray-50 border-gray-200",
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className=" cursor-pointer px-3 py-2 text-sm font-medium disabled:cursor-not-allowed text-black bg-background border border-gray-500 hover:text-gray-500 hover:border-gray-500 hover:bg-gray-100 disabled:opacity-30 rounded-none transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
