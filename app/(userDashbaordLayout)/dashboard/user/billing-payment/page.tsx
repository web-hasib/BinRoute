"use client";

import { useState } from "react";
import { CreditCard, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PaymentHistory from "@/components/sections/dashboard/PaymentHistory";
import QuickPayModal from "@/components/sections/dashboard/billing/QuickPayModal";
import EditPaymentMethodModal, { EditPaymentFormValues } from "@/components/sections/dashboard/billing/EditPaymentMethodModal";
import BillingSuccessModal from "@/components/sections/dashboard/billing/BillingSuccessModal";
import { useGetMyPaymentMethodQuery, useGetBillingInfoQuery } from "@/redux/api/subscription/subscriptionApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";

const BillingPaymentPage = () => {
  const [showQuickPay, setShowQuickPay] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [successType, setSuccessType] = useState<"payment" | "update" | null>(null);

  const { data: paymentMethodResponse, isLoading: isPaymentLoading } = useGetMyPaymentMethodQuery(undefined);
  const paymentMethod = paymentMethodResponse?.data;

  const { data: billingInfoResponse, isLoading: isBillingLoading } = useGetBillingInfoQuery(undefined);
  const billingInfo = billingInfoResponse?.data;

  const handlePaymentSuccess = () => {
    setShowQuickPay(false);
    setSuccessType("payment");
  };

  const handleUpdateSuccess = (data: EditPaymentFormValues) => {
    if (data) console.log("Updating card:", data);
    setShowEditCard(false);
    setSuccessType("update");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#172C41]">Billing & Payments</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your commercial waste disposal account invoices and payment protocols.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Automatic Billing Plan Card */}
        <div className="bg-white p-6 md:p-10 shadow-sm flex flex-col justify-between border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <p className="text-xl font-bold text-[#172C41] mb-6">Automatic Billing Plan</p>
              
              {isBillingLoading ? (
                <>
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-[#0061AA]">
                    ${billingInfo?.nextBillingInfo?.nextBillingAmount || "0.00"}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">
                    Next processing date: {billingInfo?.nextBillingInfo?.nextBillingDate ? 
                      new Date(billingInfo.nextBillingInfo.nextBillingDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      }) : "N/A"}
                  </p>
                </>
              )}
            </div>
            <div className="p-4 bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)] flex items-center justify-center">
               <div className="relative">
                <AlertTriangle className="size-8 text-[#FF4D4D] fill-[#FF4D4D]" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">i</span>
               </div>
            </div>
          </div>
          <Link href="/dashboard/user/billing-payment/manage-plans" className="w-full">
            <Button 
              variant="ghost"
              className="w-full bg-[#E6F0F9] hover:bg-blue-100 text-[#0061AA] py-7 rounded-none font-bold text-base mt-8 shadow-none"
            >
              Manage Plan & Services
            </Button>
          </Link>
        </div>

        {/* Payment Method Card */}
        <div className="bg-[#F4F9FD] p-4 md:p-8 shadow-sm flex flex-col justify-between border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-[#172C41] mb-4">Payment Method</p>
              <h2 className="text-2xl font-bold text-[#172C41] flex items-center gap-1 uppercase">
                {isPaymentLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : paymentMethod ? (
                  <>
                    <span className="capitalize mr-2">{paymentMethod.brand}</span>
                    **** **** **** <span className="text-[#0061AA]">{paymentMethod.last4}</span>
                  </>
                ) : (
                  "No card linked"
                )}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {isPaymentLoading ? (
                  <Skeleton className="h-4 w-24 mt-2" />
                ) : paymentMethod ? (
                  `Expires ${String(paymentMethod.expMonth).padStart(2, '0')}/${paymentMethod.expYear.toString().slice(-2)}`
                ) : (
                  "Add a payment method to get started"
                )}
              </p>
            </div>
            <div className="p-3 bg-white shadow-sm">
              <CreditCard className="size-6 text-[#172C41]" />
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowEditCard(true)}
            className="w-full border-gray-200 text-[#0061AA] py-6 rounded-none font-bold bg-[#E6F0F9] hover:bg-blue-100 mt-4"
          >
            Edit Details
          </Button>
        </div>
      </div>

      {/* Modals */}
      <QuickPayModal 
        isOpen={showQuickPay}
        onClose={() => setShowQuickPay(false)}
        onConfirm={handlePaymentSuccess}
        amount="$563.63"
        nextPaymentDate="May, 2025"
      />

      <EditPaymentMethodModal 
        isOpen={showEditCard}
        onClose={() => setShowEditCard(false)}
        onSubmitSuccess={handleUpdateSuccess}
      />

      {successType && (
        <BillingSuccessModal 
          isOpen={!!successType}
          onClose={() => setSuccessType(null)}
          type={successType}
        />
      )}


      {/* Payment History Component */}
      <PaymentHistory title="All Payment History" />
    </div>
  );
};

export default BillingPaymentPage;