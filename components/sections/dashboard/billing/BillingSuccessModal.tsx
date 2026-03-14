"use client";

import React from "react";
import { Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BillingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "payment" | "update";
  amount?: string;
  confirmationId?: string;
}

const BillingSuccessModal = ({
  isOpen,
  onClose,
  type,
  confirmationId = "CF-882941",
}: BillingSuccessModalProps) => {
  const isPayment = type === "payment";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={false}
      className="max-w-2xl p-0"
    >
      <div className="flex flex-col items-center text-center p-8 py-12">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="size-24 bg-[#22C55E] rounded-full flex items-center justify-center">
            <Check className="size-12 text-white stroke-[3px]" />
          </div>
          <div className="absolute -inset-2 border-2 border-[#22C55E]/20 rounded-full" />
          <div className="absolute -inset-4 border-2 border-[#22C55E]/10 rounded-full" />
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold text-[#172C41] mb-2">
          {isPayment ? "Payment of Tk successfully completed." : "Payment method updated successfully."}
        </h2>
        
        <p className="text-gray-400 text-sm mb-8 leading-relaxed px-6">
          Confirmation #{confirmationId} – Your {isPayment ? "waste management service is successfully ." : "premium waste management solution has been successfully provisioned and is ready for operation."}
          {isPayment && <><br />Date: March 5, 2026 | Time: 2:45 PM</>}
        </p>

        {isPayment && (
          <div className="w-full space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm px-4">
                <span className="text-gray-400 font-medium">Receipt Number</span>
                <span className="text-[#172C41] font-bold">#123654</span>
            </div>
            <div className="border-t border-gray-50"/>
            <div className="flex justify-between items-center text-sm px-4">
                <span className="text-gray-400 font-medium">Payment Method</span>
                <span className="text-[#172C41] font-bold">**** **** **** 1234</span>
            </div>
            <div className="border-t border-gray-50"/>
            <div className="flex justify-between items-center text-sm px-4">
                <span className="text-gray-400 font-medium">Service Frequency</span>
                <span className="text-[#172C41] font-bold">1x Per Week</span>
            </div>
            
            <div className="bg-[#F8F9FA] p-6 flex justify-between items-center">
                <span className="text-[#172C41] font-bold text-lg">Total amount</span>
                <span className="text-[#172C41] font-bold text-xl">$205.50</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Link href="/dashboard/user" className="w-full">
            <Button 
              variant="outline"
              className="w-full border-gray-100 text-[#172C41] py-7 rounded-none font-bold text-sm hover:bg-gray-50"
            >
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={onClose}
            className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-7 rounded-none font-bold text-sm"
          >
            {isPayment ? "View All Service Requests" : "View All Payment History"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BillingSuccessModal;
