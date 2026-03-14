"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CreditCardView from "./CreditCardView";

interface QuickPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  nextPaymentDate: string;
}

const QuickPayModal = ({ isOpen, onClose, onConfirm, amount, nextPaymentDate }: QuickPayModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Pay"
      description={`Next payment due ${nextPaymentDate}`}
      className="max-w-2xl"
    >
      <div className="space-y-8 py-4">
        {/* Card View */}
        <CreditCardView 
            cardHolder="Alex THOMPOSON"
            cardNumber="**** **** **** 1234"
            expiryDate="12/26"
            cardType="VISA"
        />

        {/* Total Due Box */}
        <div className="bg-[#F8F9FA] p-8 flex items-center justify-between">
          <span className="text-gray-500 font-bold text-lg">Total Due</span>
          <span className="text-[#0061AA] font-bold text-3xl">{amount}</span>
        </div>

        {/* Action */}
        <Button 
          onClick={onConfirm}
          className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-lg tracking-wide"
        >
          Conform Pay
        </Button>
      </div>
    </Modal>
  );
};

export default QuickPayModal;
