"use client"

import React, { useState } from "react"
import { PageHeader } from "@/components/ui/PageHeader"
import { DataTable, ColumnDef } from "@/components/ui/DataTable"
import { CustomPagination } from "@/components/ui/CustomPagination"
import { Button } from "@/components/ui/button"
import { Search, Eye, Trash2, MapPin, Plus } from "lucide-react"
import Link from "next/link"

export interface ServiceArea {
  id: string
  location: string
  serviceTypes: string[]
  quantity: number
  date: string
}

const mockServiceAreas: ServiceArea[] = Array(8).fill({
  id: "1",
  location: "6391 Elgin St. Celina, Delaware 10299",
  serviceTypes: ["Roll off service", "Commercial service"],
  quantity: 2,
  date: "01 march 2026"
})

export const ServiceAreaList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const columns: ColumnDef<ServiceArea>[] = [
    {
      header: "Location",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-[#4A5568]">{row.location}</span>
        </div>
      )
    },
    {
      header: "Service Type",
      cell: (row) => (
        <div className="flex flex-col gap-1 text-[#4A5568]">
          {row.serviceTypes.map((type, index) => (
            <span key={index}>{type}</span>
          ))}
        </div>
      )
    },
    {
      header: "Quantity",
      cell: (row) => (
        <span className="text-[#4A5568]">{row.quantity} Service</span>
      )
    },
    {
      header: "Date",
      accessorKey: "date"
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/services-area/edit/${row.id}`}
            className="w-8 h-8 border border-[#0265AF]/20 rounded bg-[#0265AF]/5 flex items-center justify-center text-[#0265AF] hover:bg-[#0265AF]/10 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button className="w-8 h-8 border border-[#0265AF]/20 rounded bg-[#0265AF]/5 flex items-center justify-center text-[#0265AF] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="All Services Area" />

      <div className="bg-white border border-gray-100 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-none">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
            />
          </div>

          <Link href="/dashboard/services-area/add">
            <Button variant={"primary"} className="px-6 py-2.5 h-auto flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Services Area
            </Button>
          </Link>
        </div>

        <DataTable columns={columns} data={mockServiceAreas} className="border-none" />

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
  )
}
