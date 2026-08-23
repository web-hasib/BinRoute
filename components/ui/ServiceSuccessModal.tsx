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
      className="max-w-xl p-0"
    >
      <div className="flex flex-col items-center text-center p-6 sm:p-8">
        {/* Success Icon */}
        <div className="size-14 bg-emerald-50 border border-emerald-200/80 rounded-xs flex items-center justify-center mb-5 text-emerald-600">
          <Check className="size-7 stroke-[2.5px]" />
        </div>

        {/* Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">{title}</h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-6">
          Confirmation #{confirmationId}. {message}
        </p>

        {/* Approval Process Box */}
        <div className="w-full bg-blue-50/60 border border-blue-200/60 rounded-xs p-4 mb-6 flex gap-3 text-left">
          <div className="size-5 rounded-xs bg-[#0061AA] flex items-center justify-center shrink-0 mt-0.5 text-white">
            <Info className="size-3" />
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-0.5">Approval Process</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Changes require dispatch confirmation. You will be notified within 24 hours via email and dashboard update.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <Link href="/dashboard/user" className="w-full">
            <Button 
              variant="outline"
              className="w-full py-2.5 text-xs font-semibold"
            >
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={onClose}
            variant="primary"
            className="w-full py-2.5 text-xs font-semibold"
          >
            View Service Requests
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceSuccessModal;
