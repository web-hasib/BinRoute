"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Calendar } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CreditCardView from "./CreditCardView";

export interface EditPaymentFormValues {
  holderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface EditPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: EditPaymentFormValues) => void;
}

const EditPaymentMethodModal = ({ isOpen, onClose, onSubmitSuccess }: EditPaymentMethodModalProps) => {
  const { register, handleSubmit } = useForm<EditPaymentFormValues>({
    defaultValues: {
      holderName: "Alex THOMPOSON",
      cardNumber: "4242 4242 4242 1234",
      expiryDate: "2026-12",
      cvv: "****"
    }
  });

  const onSubmit = (data: EditPaymentFormValues) => {
    console.log("Edit Payment Method Form Data:", data);
    onSubmitSuccess(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Payment Method"
      description="Manage and track your dumpster services."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
        {/* Card Preview */}
        <CreditCardView 
            cardHolder="Alex THOMPOSON"
            cardNumber="**** **** **** 1234"
            expiryDate="12/26"
            cardType="VISA"
        />

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#172C41]">Account Holder Name</label>
            <input
              type="text"
              {...register("holderName")}
              placeholder="Enter name"
              className="w-full p-4 bg-[#F8F9FA] border-none outline-none text-gray-800 font-medium text-sm placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-[#172C41]">Card Number</label>
            <div className="relative">
              <input
                type="text"
                {...register("cardNumber")}
                placeholder="0000 0000 0000 0000"
                className="w-full p-4 bg-[#F8F9FA] border-none outline-none text-gray-800 font-medium text-sm placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 size-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Expiry Date</label>
              <div className="relative">
                <input
                  type="date"
                  {...register("expiryDate")}
                  className="w-full p-4 bg-[#F8F9FA] border-none outline-none text-gray-800 font-medium text-sm focus:bg-gray-100 transition-colors appearance-none"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">CVV</label>
              <input
                type="text"
                {...register("cvv")}
                placeholder="****"
                className="w-full p-4 bg-[#F8F9FA] border-none outline-none text-gray-800 font-medium text-sm placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-lg tracking-wide"
        >
          Update Card
        </Button>
      </form>
    </Modal>
  );
};

export default EditPaymentMethodModal;
