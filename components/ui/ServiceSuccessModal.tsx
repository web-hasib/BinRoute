"use client";

import React from "react";
import { Check, Info } from "lucide-react";
import { Button } from "./button";
import Modal from "./Modal";
import Link from "next/link";

interface ServiceSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  confirmationId: string;
  message: string;
}

const ServiceSuccessModal = ({
  isOpen,
  onClose,
  title,
  confirmationId,
  message,
}: ServiceSuccessModalProps) => {
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
        <h2 className="text-3xl font-bold text-[#172C41] mb-2">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">
          Confirmation #{confirmationId}. {message}
        </p>

        {/* Approval Process Box */}
        <div className="w-full bg-[#F4FAFF] border border-[#E6F4FF] p-6 mb-8 flex gap-4 text-left">
          <div className="p-1.5 bg-[#0061AA] rounded-full h-fit mt-0.5">
            <Info className="size-3 text-white" />
          </div>
          <div>
            <h4 className="text-[#172C41] font-bold text-sm mb-1">Approval Process</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Changes require admin approval. You will be notified of the decision within 24 hours via email and dashboard alert.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Link href="/dashboard/user" className="w-full">
            <Button 
              variant="outline"
              className="w-full border-gray-100 text-gray-500 py-7 rounded-none font-bold text-sm hover:bg-gray-50 uppercase tracking-wider"
            >
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={onClose}
            className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-7 rounded-none font-bold text-sm uppercase tracking-wider"
          >
            View All Service Requests
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceSuccessModal;
