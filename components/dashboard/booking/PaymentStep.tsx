"use client";

import React from "react";
import { CreditCard, Calendar, ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ onNext, onBack }: PaymentStepProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Left Column: Payment Form */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="bg-[#EBF6FF] p-2 rounded-sm">
                <CreditCard className="w-6 h-6 text-[#0265AF]" />
            </div>
            <h3 className="text-xl font-bold text-[#0c243c]">Payment</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Account Holder Name</label>
              <input 
                type="text" 
                placeholder="Enter name"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#0c243c] mb-2">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    defaultValue="12 Dec 2026"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0c243c] mb-2">CVV</label>
                <div className="relative">
                  <input 
                    type="password" 
                    defaultValue="****"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar (Small variations from Step 2 image) */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-[#0c243c] p-6 text-white text-center sm:text-left">
            <h3 className="text-xl font-bold">Transparent Roll Off Pricing</h3>
            <p className="text-xs text-gray-400 mt-1 opacity-80 font-normal">Distance-Based Pricing (From 103 Creeper Rd, Grafton, MA)</p>
          </div>

          <div className="p-6">
             <div className="space-y-5">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium tracking-tight">Distance</span>
                  <span className="font-bold text-[#0c243c]">32 miles</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium tracking-tight">Dumpster Size</span>
                  <span className="font-bold text-[#0c243c]">2 Yard Dumpster</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium tracking-tight">Service Frequency</span>
                  <span className="font-bold text-[#0c243c]">1x Per Week</span>
               </div>
               
               <hr className="border-gray-50" />
               
               <div className="space-y-4 pt-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Subtotal Address</span>
                    <span className="font-bold text-[#0c243c]">$80</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Environmental Tax (6%)</span>
                    <span className="font-bold text-[#0c243c]">$25.50</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Service Area Fee</span>
                    <span className="font-bold text-[#0c243c]">$100</span>
                  </div>
               </div>

               <hr className="border-dashed border-gray-200 mt-6" />
               <div className="flex justify-between items-center pt-2">
                  <span className="text-[18px] font-bold text-[#0c243c]">Total amount</span>
                  <span className="text-2xl font-bold text-[#0c243c]">$205.50</span>
               </div>

               <Button 
                 onClick={onNext}
                 className="w-full bg-[#0265AF] hover:bg-[#004d85] text-white py-8 text-lg font-bold rounded-none mt-6 transition-all shadow-md active:scale-95"
               >
                 Confirm Booking
               </Button>

               <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed px-2">
                  By clicking &apos;Complete Booking,&apos; you agree to our <span className="text-[#0265AF] font-bold underline cursor-pointer">Terms of Service</span> and Rental Agreement. This rental is non-refundable once dispatched.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
