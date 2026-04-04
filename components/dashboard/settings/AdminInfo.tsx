"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, User, Phone, Mail, MapPin, Edit, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminInfo = () => {
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
          {/* Header Cover */}
          <div className="relative h-48 w-full bg-linear-to-r from-gray-200 to-gray-300">
            <Image 
              src="/dummy.png"
              alt="Profile Cover"
              fill
              className="object-cover opacity-50"
            />
          </div>

          {/* Profile Basic Info */}
          <div className="px-8 pb-10 relative">
            <div className="flex justify-between items-end -mt-16 mb-8 relative z-10">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <Image 
                  src="/driver_profile_avatar_1775316560340.png"
                  alt="Tomas Diko"
                  fill
                  className="object-cover"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-[#0265AF] text-white rounded-full border-2 border-white hover:bg-[#0265AF]/90 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-10 space-y-10 border-t border-gray-100">
            <h3 className="text-xl font-bold text-[#172C41]">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="text"
                    placeholder={isEditing ? "Write down your new name......" : "Tomas Diko"}
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="text"
                    placeholder={isEditing ? "Write down your new phone number......" : "12 Dec 2026"}
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="email"
                    placeholder={isEditing ? "Write down your new email......" : "null@gmail.com"}
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="text"
                    placeholder={isEditing ? "Write down your new address......" : "12 Dec 2026"}
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                {!isEditing ? (
                    <Button 
                        onClick={() => setIsEditing(true)}
                        variant="primary"
                        className="flex items-center gap-2 h-auto py-3.5"
                    >
                        <Edit className="w-4 h-4" /> Edit Personal Information
                    </Button>
                ) : (
                    <>
                        <Button 
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            className="px-10 border-[#0265AF] text-[#0265AF] hover:bg-blue-50 h-auto py-3.5 rounded-none font-bold"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => setIsEditing(false)}
                            variant="primary"
                            className="h-auto py-3.5"
                        >
                            Save Changes
                        </Button>
                    </>
                )}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white p-10 border border-gray-100 shadow-sm space-y-10 rounded-none">
          <h3 className="text-xl font-bold text-[#172C41]">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-[#172C41]">Old Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <input
                  type="password"
                  defaultValue="123456789"
                  className="w-full pl-14 pr-12 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF]"
                />
                <Eye className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[15px] font-bold text-[#172C41]">New Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <input
                  type="password"
                  defaultValue="123456789"
                  className="w-full pl-14 pr-12 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF]"
                />
                <Eye className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
              <Button 
                variant="outline"
                className="px-10 border-[#0265AF] text-[#0265AF] hover:bg-blue-50 h-auto py-3.5 rounded-none font-bold"
              >
                  Cancel
              </Button>
              <Button 
                variant="primary"
                className="h-auto py-3.5"
              >
                  Save New Password
              </Button>
          </div>
        </div>
      </div>
    );
};

export default AdminInfo;
