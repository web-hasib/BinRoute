"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  onBackToDashboard: () => void;
  onBookAgain: () => void;
  onClose: () => void;
}

const SuccessModal = ({ onBackToDashboard, onBookAgain, onClose }: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-green-50 p-4 rounded-full border border-green-100 flex items-center justify-center">
             <CheckCircle2 className="w-20 h-20 text-[#22C55E] fill-current text-white bg-[#22C55E] rounded-full" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#0c243c]">Your Commercial Service is Active</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
               Confirmation #CF-882941. Your premium waste management solution has been successfully provisioned and is ready for operation.
            </p>
          </div>

          <div className="w-full space-y-3 mt-4 text-left border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center py-2 px-4">
              <span className="text-gray-500 font-medium tracking-tight">Order Id</span>
              <span className="font-bold text-[#0c243c]">#123654</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4">
              <span className="text-gray-500 font-medium tracking-tight">Dumpster Size</span>
              <span className="font-bold text-[#0c243c]">2 Yard Dumpster</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4">
               <span className="text-gray-500 font-medium tracking-tight">Service Frequency</span>
               <span className="font-bold text-[#0c243c]">1x Per Week</span>
            </div>
            
            <hr className="border-gray-50" />
            
            <div className="space-y-2 mt-4 px-4 pb-4">
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

            <hr className="border-dashed border-gray-200" />
            <div className="flex justify-between items-center pt-4 px-4">
               <span className="text-xl font-bold text-[#0c243c]">Total amount</span>
               <span className="text-2xl font-bold text-[#0c243c]">$205.50</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full pt-8">
            <Button 
                onClick={onBackToDashboard} 
                className="flex-1 py-7 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-[#0c243c] font-bold rounded-none shadow-sm transition-all"
            >
              Back to Dashboard
            </Button>
            <Button 
                onClick={onBookAgain}
                className="flex-1 py-7 bg-[#0265AF] hover:bg-[#004d85] text-white font-bold rounded-none shadow-md transition-all active:scale-95"
            >
              Book again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
