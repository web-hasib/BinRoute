"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Mail, MapPin, Phone, User, Edit2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AdminInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Tomas Diko",
    phoneNumber: "12 Dec 2026",
    email: "null@gmail.com",
    address: "12 Dec 2026",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "123456789",
    newPassword: "123456789",
  });

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);
  const handleSaveClick = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-none border border-gray-100 overflow-hidden">
        <div className="h-32 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="px-8 pb-8 -mt-12 flex items-end gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                alt="Admin Profile"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-[#0062FF] text-white rounded-full border-2 border-white hover:bg-[#0052D9] transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-8 rounded-none border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1A1A]">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={formData.fullName}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] disabled:cursor-not-allowed text-[#1A1A1A]"
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
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] disabled:cursor-not-allowed text-[#1A1A1A]"
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
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] disabled:cursor-not-allowed text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1A1A]">Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={formData.address}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] disabled:cursor-not-allowed text-[#1A1A1A]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {!isEditing ? (
            <Button
              onClick={handleEditClick}
              className="bg-[#0062FF] hover:bg-[#0052D9] text-white rounded-none flex items-center gap-2 px-6"
            >
              <Edit2 className="w-4 h-4" />
              Edit Personal Information
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancelClick}
                variant="outline"
                className="rounded-none border-[#0062FF] text-[#0062FF] hover:bg-blue-50 px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveClick}
                className="bg-[#0062FF] hover:bg-[#0052D9] text-white rounded-none px-8"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white p-8 rounded-none border border-gray-100">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1A1A]">Old Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showOldPassword ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] text-[#1A1A1A]"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1A1A1A]">New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#0062FF] text-[#1A1A1A]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-none border-[#0062FF] text-[#0062FF] hover:bg-blue-50 px-8"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#0062FF] hover:bg-[#0052D9] text-white rounded-none px-8"
          >
            Save New Password
          </Button>
        </div>
      </div>
    </div>
  );
};
