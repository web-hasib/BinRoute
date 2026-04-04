"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const AddAdmin = () => {
    const router = useRouter();

    return (
      <div className="space-y-8 pb-12 animate-in fade-in duration-500">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Add New Admin
        </button>

        <div className="bg-white p-10 border border-gray-100 shadow-sm space-y-12 rounded-none">
          <h3 className="text-xl font-bold text-[#172C41]">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-[#172C41]">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <input
                  type="text"
                  placeholder="Tomas Diko"
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
                  placeholder="12 Dec 2026"
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
                  placeholder="null@gmail.com"
                  className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-10">
            <Button 
                onClick={() => router.back()}
                variant="outline"
                className="px-10 border-[#0265AF] text-[#0265AF] hover:bg-blue-50 h-auto py-3.5 rounded-none font-bold"
            >
                Cancel
            </Button>
            <Button 
                onClick={() => router.back()}
                variant="primary"
                className="h-auto py-3.5"
            >
                Add As Admin
            </Button>
          </div>
        </div>
      </div>
    );
};

export default AddAdmin;
