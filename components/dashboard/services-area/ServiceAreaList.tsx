"use client"

import React, { useState, useEffect } from "react"
import { PageHeader } from "@/components/ui/PageHeader"
import { DataTable, ColumnDef } from "@/components/ui/DataTable"
import { CustomPagination } from "@/components/ui/CustomPagination"
import { Button } from "@/components/ui/button"
import { Search, Eye, Trash2, MapPin, Plus, Loader2, Pencil } from "lucide-react"
import Link from "next/link"
import { useGetServiceAreasQuery } from "@/redux/api/service-area/serviceAreaApi"
import { IServiceArea } from "@/types/global"
import { format } from "date-fns"

export const ServiceAreaList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // Reset to first page on search
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  const { data, isLoading, isFetching } = useGetServiceAreasQuery({
    page: currentPage,
    limit: rowsPerPage,
    searchTerm: debouncedSearch,
  })

  const serviceAreas = data?.data || []
  const meta = data?.meta

  const columns: ColumnDef<IServiceArea>[] = [
    {
      header: "Location",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-[#1D2939] font-medium">{row.name}</span>
          </div>
          <span className="text-xs text-gray-500 pl-6 line-clamp-1">{row.address}</span>
        </div>
      )
    },
    {
      header: "Service Type",
      cell: (row) => (
        <div className="flex flex-col gap-1 text-[#4A5568]">
          {row.plans && row.plans.length > 0 ? (
            Array.from(new Set(row.plans.map(p => p.plan.category))).map((category, index) => (
              <span key={index} className="text-sm capitalize">
                {category.toLowerCase().replace("_", " ")}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400 italic">No services</span>
          )}
        </div>
      )
    },
    {
      header: "Postal Codes",
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {row.postalCodes.map((code, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {code}
            </span>
          ))}
        </div>
      )
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="text-sm text-[#4A5568]">
          {row.createdAt ? format(new Date(row.createdAt), "dd MMM yyyy") : "N/A"}
        </span>
      )
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/services-area/edit/${row.id}`}
            title="Edit"
            className="w-8 h-8 border border-[#0265AF]/20 rounded bg-[#0265AF]/5 flex items-center justify-center text-[#0265AF] hover:bg-[#0265AF]/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          {/* <button className="w-8 h-8 border border-[#0265AF]/20 rounded bg-[#0265AF]/5 flex items-center justify-center text-[#0265AF] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button> */}
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
              placeholder="Search by name, address or postal code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-100 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
            />
            {(isLoading || isFetching) && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0265AF] animate-spin" />
            )}
          </div>

          <Link href="/dashboard/services-area/add">
            <Button variant={"primary"} className="px-6 py-2.5 h-auto flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Services Area
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={serviceAreas}
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
  )
}
