"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  adminSince: string;
}

const mockAdmins: AdminUser[] = Array(7).fill({
  id: "1",
  name: "Muntakim",
  email: "null@gmail.com",
  phoneNumber: "9567045677",
  adminSince: "01 march 2026",
});

const AdminManagement = () => {
    const adminColumns: ColumnDef<AdminUser>[] = [
      { header: "Name", accessorKey: "name" },
      { header: "Email", accessorKey: "email" },
      { header: "Phone Number", accessorKey: "phoneNumber" },
      { header: "Admin Since", accessorKey: "adminSince" },
      {
        header: "Action",
        cell: () => (
          <button className="bg-red-50 text-red-500 font-bold px-6 py-2 text-[11px] rounded-none hover:bg-red-100 transition-colors">
            Suspend
          </button>
        )
      }
    ];

    const suspendedColumns: ColumnDef<AdminUser>[] = [
      ...adminColumns.slice(0, 4),
      {
        header: "Action",
        cell: () => (
          <button className="bg-green-50 text-green-500 font-bold px-6 py-2 text-[11px] rounded-none hover:bg-green-100 transition-colors">
            End Suspension
          </button>
        )
      }
    ];

    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        {/* Admin List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#172C41]">Admin List</h3>
            <Link href="/dashboard/settings/management/add">
                <Button 
                    variant="primary"
                    className="flex items-center gap-2 h-10 px-6"
                >
                    <Plus className="w-4 h-4" /> Add New Admin
                </Button>
            </Link>
          </div>
          <div className="bg-white border border-gray-100 shadow-sm rounded-none overflow-hidden">
             <DataTable columns={adminColumns} data={mockAdmins} className="border-none" />
          </div>
        </div>

        {/* Suspended Admin */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#172C41]">Suspended Admin</h3>
          <div className="bg-white border border-gray-100 shadow-sm rounded-none overflow-hidden">
             <DataTable columns={suspendedColumns} data={mockAdmins.slice(0, 5)} className="border-none" />
          </div>
        </div>
      </div>
    );
};

export default AdminManagement;
