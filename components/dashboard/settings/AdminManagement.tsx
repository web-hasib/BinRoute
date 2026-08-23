"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useGetAdminsQuery, useToggleUserStatusMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface AdminUser {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
  phone: string;
  createdAt: string;
}

const AdminManagement = () => {
    const { data: activeAdminsData, isLoading: isActiveLoading } = useGetAdminsQuery({ status: "ACTIVE" });
    const { data: blockedAdminsData, isLoading: isBlockedLoading } = useGetAdminsQuery({ status: "BLOCKED" });
    const [toggleStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

    const activeAdmins: AdminUser[] = activeAdminsData?.data || [];
    const blockedAdmins: AdminUser[] = blockedAdminsData?.data || [];

    const [loadingId, setLoadingId] = React.useState<string | null>(null);

    const handleToggle = async (id: string, newStatus: "ACTIVE" | "BLOCKED") => {
        setLoadingId(id);
        try {
            await toggleStatus({ id, status: newStatus }).unwrap();
            toast.success(`Admin successfully ${newStatus === 'BLOCKED' ? 'blocked' : 'unblocked'}`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update admin status");
        } finally {
            setLoadingId(null);
        }
    };

    const adminColumns: ColumnDef<AdminUser>[] = [
      { 
        header: "Name", 
        cell: (item) => item.fullName || item.name || "N/A"
      },
      { header: "Email", accessorKey: "email" },
      { header: "Phone Number", accessorKey: "phone" },
      { 
        header: "Admin Since", 
        cell: (item) => item.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy") : "N/A"
      },
      {
        header: "Action",
        cell: (item) => (
          <button 
            onClick={() => handleToggle(item.id, "BLOCKED")}
            disabled={isToggling || loadingId === item.id}
            className="bg-red-50 text-red-500 font-bold w-20 h-8 flex items-center justify-center text-[11px] rounded-none hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Block"}
          </button>
        )
      }
    ];

    const blockedColumns: ColumnDef<AdminUser>[] = [
      { 
        header: "Name", 
        cell: (item) => item.fullName || item.name || "N/A"
      },
      { header: "Email", accessorKey: "email" },
      { header: "Phone Number", accessorKey: "phone" },
      { 
        header: "Admin Since", 
        cell: (item) => item.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy") : "N/A"
      },
      {
        header: "Action",
        cell: (item) => (
          <button 
            onClick={() => handleToggle(item.id, "ACTIVE")}
            disabled={isToggling || loadingId === item.id}
            className="bg-green-50 text-green-500 font-bold w-20 h-8 flex items-center justify-center text-[11px] rounded-none hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            {loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unblock"}
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
             <DataTable columns={adminColumns} data={activeAdmins} isLoading={isActiveLoading} className="border-none" />
          </div>
        </div>

        {/* Blocked Admin */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#172C41]">Blocked Admin</h3>
          <div className="bg-white border border-gray-100 shadow-sm rounded-none overflow-hidden">
             <DataTable columns={blockedColumns} data={blockedAdmins} isLoading={isBlockedLoading} className="border-none" />
          </div>
        </div>
      </div>
    );
};

export default AdminManagement;
