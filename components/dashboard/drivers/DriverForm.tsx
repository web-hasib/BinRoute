"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, MapPin, Lock, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DriverFormProps {
    mode: "add" | "edit";
    id?: string;
}

const DriverForm = ({ mode, id }: DriverFormProps) => {
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate save logic
        if (mode === "add") {
            setIsSubmitted(true);
        } else {
            router.back();
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[calc(100vh-130px)]  flex flex-col items-center justify-center space-y-8 overflow-y-hidden">
                <div className="relative w-48 h-48">
                <Image 
                    src="/dummy.png"
                    alt="Success"
                    fill
                    className="object-contain"
                />
                </div>
                <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-[#172C41]">You Added Tomas Diko as a Driver</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                    You have successfully added a new driver. Now you can <br /> assign jobs to the new driver.
                </p>
                </div>
                <Button 
                    onClick={() => router.push("/dashboard/drivers")}
                    className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white font-bold px-12 py-4 h-auto rounded-none text-lg mt-8"
                >
                Check Job Status
                </Button>
            </div>
        );
    }

    return (
      <div className="space-y-8 pb-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          {mode === "add" ? "Add New Driver" : "Edit Driver Details"}
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          {/* Personal Information */}
          <div className="bg-white p-10 border border-gray-100 shadow-sm space-y-8 rounded-none">
            <h3 className="text-lg font-bold text-[#172C41]">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Tomas Diko" 
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="12 Dec 2026" 
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="null@gmail.com" 
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="12 Dec 2026" 
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Login Credential (Only for Add) */}
          {mode === "add" && (
            <div className="bg-white p-10 border border-gray-100 shadow-sm space-y-8 rounded-none">
              <h3 className="text-lg font-bold text-[#172C41]">Login Credential</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#172C41]">Email For Login</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="null@gmail.com" 
                      className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#172C41]">One Time Password For Login</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="123456789" 
                      className="w-full pl-12 pr-12 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                    />
                    <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => router.back()}
                    className="px-8 py-3 font-bold border-gray-200 text-gray-500 h-auto rounded-none"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white font-bold px-8 py-3 h-auto rounded-none"
                >
                    Save Driver Information and Send Credentials
                </Button>
              </div>
            </div>
          )}

          {/* Buttons for Edit */}
          {mode === "edit" && (
            <div className="flex justify-end gap-4">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => router.back()}
                    className="px-8 py-3 font-bold border-gray-200 text-[#0265AF] h-auto rounded-none"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white font-bold px-8 py-3 h-auto rounded-none"
                >
                    Save Changes
                </Button>
            </div>
          )}
        </form>
      </div>
    );
};

export default DriverForm;
