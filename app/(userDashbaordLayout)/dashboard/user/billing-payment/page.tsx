"use client";

import { useState } from "react";
import { CreditCard, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentHistory from "@/components/sections/dashboard/PaymentHistory";
import QuickPayModal from "@/components/sections/dashboard/billing/QuickPayModal";
import EditPaymentMethodModal, { EditPaymentFormValues } from "@/components/sections/dashboard/billing/EditPaymentMethodModal";
import BillingSuccessModal from "@/components/sections/dashboard/billing/BillingSuccessModal";

const BillingPaymentPage = () => {
  const [showQuickPay, setShowQuickPay] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [successType, setSuccessType] = useState<"payment" | "update" | null>(null);

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
        {/* Quick Pay Card */}
        <div className="bg-white p-4 md:p-8 shadow-sm flex flex-col justify-between border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-[#172C41] mb-4">Quick Pay</p>
              <h2 className="text-3xl font-bold text-[#0061AA]">$563.63</h2>
              <p className="text-gray-400 text-xs mt-1">Next payment due May, 2025</p>
            </div>
            <div className="p-2 bg-red-50 relative">
               <AlertTriangle className="size-6 text-red-500" />
               <div className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
          </div>
          <Button 
            onClick={() => setShowQuickPay(true)}
            className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-6 rounded-none font-bold flex items-center justify-center gap-2 mt-4"
          >
            Pay now <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Payment Method Card */}
        <div className="bg-[#F4F9FD] p-4 md:p-8 shadow-sm flex flex-col justify-between border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-[#172C41] mb-4">Payment Method</p>
              <h2 className="text-2xl font-bold text-[#172C41] flex items-center gap-1">
                **** **** **** <span className="text-[#0061AA]">1234</span>
              </h2>
              <p className="text-gray-400 text-xs mt-1">Expires 12/26</p>
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