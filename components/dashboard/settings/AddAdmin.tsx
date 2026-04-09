"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddAdminMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";

const AddAdmin = () => {
    const router = useRouter();
    const [addAdmin, { isLoading }] = useAddAdminMutation();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!fullName || !phone || !email) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await addAdmin({ fullName, email, phone }).unwrap();
            toast.success("Admin added successfully");
            router.back();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add admin");
        }
    };

    return (
      <div className="space-y-8 pb-12 animate-in fade-in duration-500">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Add New Admin
        </button>

        <form onSubmit={handleSubmit} className="bg-white p-10 border border-gray-100 shadow-sm space-y-12 rounded-none">
          <h3 className="text-xl font-bold text-[#172C41]">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-[#172C41]">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tomas Diko"
                  required
                  className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-[#172C41]">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  required
                  className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-[#172C41]">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-10">
            <Button 
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="px-10 border-[#0265AF] text-[#0265AF] hover:bg-blue-50 h-auto py-3.5 rounded-none font-bold"
            >
                Cancel
            </Button>
            <Button 
                type="submit"
                disabled={isLoading}
                className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white h-auto py-3.5 rounded-none min-w-[140px]"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Add As Admin"}
            </Button>
          </div>
        </form>
      </div>
    );
};

export default AddAdmin;
