"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { AddNewAdmin } from "./AddNewAdmin";

interface AdminUser {
  name: string;
  email: string;
  phone: string;
  adminSince: string;
}

export const AdminManagement = () => {
  const [isAdding, setIsAdding] = useState(false);

  const adminList: AdminUser[] = [
    { name: "Muntakim", email: "null@gmail.com", phone: "9567045677", adminSince: "01 march 2026" },
    { name: "Muntakim", email: "null@gmail.com", phone: "9567045677", adminSince: "01 march 2026" },
    { name: "Muntakim", email: "null@gmail.com", phone: "9567045677", adminSince: "01 march 2026" },
    { name: "Muntakim", email: "null@gmail.com", phone: "9567045677", adminSince: "01 march 2026" },
    { name: "Muntakim", email: "null@gmail.com", phone: "9567045677", adminSince: "01 march 2026" },
  ];

  const columns: ColumnDef<AdminUser>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone Number", accessorKey: "phone" },
    { header: "Admin Since", accessorKey: "adminSince" },
    {
      header: "Action",
      cell: () => (
        <button className="text-[#FF4D4D] bg-[#FFEBEB] px-4 py-1.5 text-xs font-semibold hover:bg-[#FFD6D6] transition-colors">
          Suspend
        </button>
      ),
    },
  ];

  const suspendedColumns: ColumnDef<AdminUser>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone Number", accessorKey: "phone" },
    { header: "Admin Since", accessorKey: "adminSince" },
    {
      header: "Action",
      cell: () => (
        <button className="text-[#00A854] bg-[#EBFBF2] px-4 py-1.5 text-xs font-semibold hover:bg-[#D4F7E4] transition-colors">
          End Suspension
        </button>
      ),
    },
  ];

  if (isAdding) {
    return <AddNewAdmin onBack={() => setIsAdding(false)} />;
  }

  return (
    <div className="space-y-8">
      {/* Admin List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Admin List</h2>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-[#0062FF] hover:bg-[#0052D9] text-white rounded-none flex items-center gap-2 px-6"
          >
            <Plus className="w-4 h-4" />
            Add New Admin
          </Button>
        </div>
        <DataTable columns={columns} data={adminList} />
      </div>

      {/* Suspended Admin */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Suspended Admin</h2>
        <DataTable columns={suspendedColumns} data={adminList} />
      </div>
    </div>
  );
};
