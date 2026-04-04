"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContactDetailsProps {
    id: string;
}

const ContactUsDetails = ({ id }: ContactDetailsProps) => {
    const router = useRouter();

    return (
      <div className="space-y-8 pb-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#2f3234] font-semibold text-xl mb-4"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Details
        </button>

        <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-12 rounded-none">
          <h3 className="text-xl font-semibold text-[#2f3234]">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <label className="text-md font-semibold text-[#5f6162]">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <div className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-gray-400 font-medium rounded-none min-h-[56px] flex items-center">
                  Write down your new name......
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-md font-semibold text-[#5f6162]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                <div className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-gray-400 font-medium rounded-none min-h-[56px] flex items-center">
                  Write down your new Email......
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-md font-semibold text-[#5f6162]">Subject</label>
              <div className="w-full px-6 py-6 bg-[#F8FAFC] border-none text-sm text-gray-400 font-medium rounded-none min-h-[140px] leading-relaxed">
                I wanted to know about your service and, do you provide service in the area of west texas
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-md font-semibold text-[#5f6162]">Message</label>
              <div className="w-full px-6 py-6 bg-[#F8FAFC] border-none text-sm text-gray-400 font-medium rounded-none min-h-[140px] leading-relaxed">
                I wanted to know about your service and, do you provide service in the area of west texas
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-10">
            <Button 
                onClick={() => router.back()}
               variant={"primary"}
               className="h-12 text-md font-thin"
            >
                Mark As Read
            </Button>
          </div>
        </div>
      </div>
    );
};

export default ContactUsDetails;
