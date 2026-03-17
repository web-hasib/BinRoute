"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  className?: string;
}

export function DataTable<T>({ columns, data, className }: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "bg-white overflow-hidden border border-gray-100 rounded-none",
        className,
      )}
    >
      <div className="overflow-x-auto scrollbar-hide scrollbar-thin">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-[#fbfcff]">
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-[#666666] border-none"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="px-6 py-4 text-sm text-[#1A1A1A] whitespace-nowrap border-none"
                    >
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                          ? (item[column.accessorKey] as React.ReactNode)
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-[#666666]"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
