"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddNewAdminProps {
  onBack: () => void;
}

export const AddNewAdmin = ({ onBack }: AddNewAdminProps) => {
  const [formData, setFormData] = useState({
    fullName: "Tomas Diko",
    phoneNumber: "12 Dec 2026",
    email: "null@gmail.com",
  });

  const handleSave = () => {
    // Save logic
    onBack();
  };

  return (
    <div className="bg-white p-8 rounded-none border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>
        <h2 className="text-xl font-bold text-[#1A1A1A]">Add New Admin</h2>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1A1A]">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1A1A]">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1A1A]">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] text-[#1A1A1A]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-none border-[#0062FF] text-[#0062FF] hover:bg-blue-50 px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#0062FF] hover:bg-[#0052D9] text-white rounded-none px-8"
          >
            Add As Admin
          </Button>
        </div>
      </div>
    </div>
  );
};
