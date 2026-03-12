"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Calendar, CreditCard } from "lucide-react";
import PricingSidebar from "./PricingSidebar";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ onNext, onBack }: PaymentStepProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-8">
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-8">Payment Method</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/yyyy"
                    className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="****"
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar */}
      <div className="lg:col-span-4">
        <PricingSidebar 
           buttonText="Checkout"
           onButtonClick={onNext}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
