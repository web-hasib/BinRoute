"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Calendar } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import CreditCardView from "./CreditCardView";
import { useUpdatePaymentMethodMutation } from "@/redux/api/subscription/subscriptionApi";
import { toast } from "sonner";

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
  const { register, handleSubmit, setValue, watch } = useForm<EditPaymentFormValues>({
    defaultValues: {
      holderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    }
  });

  const formValues = watch();

  const [updatePaymentMethod, { isLoading }] = useUpdatePaymentMethodMutation();

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/\D/g, "");
    
    // Format as MM/YY
    if (cleanValue.length > 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }
    return cleanValue;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    // @ts-ignore
    setValue("expiryDate", formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    // @ts-ignore
    setValue("cvv", value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    // @ts-ignore
    setValue("cardNumber", value);
  };

  const onSubmit = async (data: EditPaymentFormValues) => {
    try {
      // 1. Stripe API Call to create payment method
      const stripeHeaders = new Headers();
      stripeHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      stripeHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

      const [month, yearShort] = data.expiryDate.split("/");
      const year = `20${yearShort}`;
      
      const urlencoded = new URLSearchParams();
      urlencoded.append("type", "card");
      urlencoded.append("card[number]", data.cardNumber.replace(/\s/g, ""));
      urlencoded.append("card[exp_month]", month);
      urlencoded.append("card[exp_year]", year);
      urlencoded.append("card[cvc]", data.cvv);

      const stripeRes = await fetch("https://api.stripe.com/v1/payment_methods", {
        method: "POST",
        headers: stripeHeaders,
        body: urlencoded,
      });

      const stripeResult = await stripeRes.json();

      if (!stripeRes.ok) {
        throw new Error(stripeResult.error?.message || "Failed to validate card with Stripe");
      }

      // 2. Backend API Call to update payment method with the ID from Stripe
      const response = await updatePaymentMethod({ 
        paymentMethodId: stripeResult.id 
      }).unwrap();

      if (response.success) {
        toast.success("Payment method updated successfully!");
        onSubmitSuccess(data);
      }
    } catch (error: any) {
      console.error("Error updating payment method:", error);
      toast.error(error?.message || error?.data?.message || "Something went wrong while updating payment method");
    }
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
            cardHolder={formValues.holderName || "FULL NAME"}
            cardNumber={formValues.cardNumber || "**** **** **** ****"}
            expiryDate={formValues.expiryDate || "MM/YY"}
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
                maxLength={16}
                onChange={handleCardNumberChange}
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
                  type="text"
                  {...register("expiryDate")}
                  placeholder="MM/YY"
                  maxLength={5}
                  onChange={handleExpiryChange}
                  className="w-full p-4 bg-[#F8F9FA] border-none outline-none text-gray-800 font-medium text-sm focus:bg-gray-100 transition-colors"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 mt-0.5 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">CVV</label>
              <input
                type="text"
                {...register("cvv")}
                placeholder="123"
                maxLength={4}
                onChange={handleCvvChange}
                className="w-full p-4 bg-[#F8F9FA] border-none outline-none text-gray-800 font-medium text-sm placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-lg tracking-wide disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Card"}
        </Button>
      </form>
    </Modal>
  );
};

export default EditPaymentMethodModal;
