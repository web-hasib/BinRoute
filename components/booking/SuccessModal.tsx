"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetBooking } from "@/feature/user/bookingSlice";

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal = ({ onClose }: SuccessModalProps) => {
  const dispatch = useDispatch();
  const { serviceType, dumpsterSize, pricing, dropOffAddress } = useSelector(
    (state: RootState) => state.booking,
  );

  const handleBackToDashboard = () => {
    dispatch(resetBooking());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleBackToDashboard}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl py-12 px-16 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-125 blur-sm opacity-50" />
            <CheckCircle2 className="w-20 h-20 text-[#28a745] fill-white relative z-10" />
          </div>

          <h2 className="text-3xl font-bold text-[#0c243c] mb-2">
            Your Roll of Service is Active
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Confirmation #CF-882941. Your premium waste management solution has
            been successfully provisioned and is ready for operation.
          </p>
        </div>

        {/* Order Details */}
        <div className="mt-10 space-y-4">
          <DetailRow label="Order Id" value="#123654" />
          <DetailRow label="Calculated Distance" value="42.4 Miles" />
          <DetailRow
            label="Service Type"
            value={
              serviceType === "roll-off"
                ? "Roll of Dumpster Service"
                : "Commercial Service"
            }
          />
          <DetailRow
            label="Dumpster Size"
            value={dumpsterSize?.replace("-", " ") + " Roll Off"}
            isUpper
          />
          <DetailRow
            label="Rental Duration"
            value="1 Month (Nov 12 - Dec 12)"
          />
          <DetailRow
            label="Delivery Address"
            value={
              dropOffAddress ||
              "1402 Industry Ave, Building B Detroit, MI 48201"
            }
          />
        </div>

        {/* Price Breakdown */}
        <div className="mt-8 pt-8 border-t border-dashed border-gray-200 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal Address</span>
            <span className="font-bold text-[#0c243c]">
              ${pricing.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Environmental Tax (6%)</span>
            <span className="font-bold text-[#0c243c]">
              ${pricing.tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Calculated Distance Free</span>
            <span className="font-bold text-[#0c243c]">
              ${pricing.fee.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-between items-center text-[#0c243c]">
          <span className="text-2xl font-bold">Total amount</span>
          <span className="text-2xl font-bold">
            ${pricing.total.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-10 flex gap-4">
          <Button
            onClick={handleBackToDashboard}
            variant="ghost"
            className="flex-1 bg-[#F1F1F1] hover:bg-gray-200 text-[#4A4A4A] py-6 rounded-none font-bold"
          >
            Back to Dashboard
          </Button>
          <Button className="flex-1 bg-[#0265AF] hover:bg-[#004d85] text-white py-6 rounded-none font-bold flex gap-2">
            <Download className="w-4 h-4" />
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  isUpper = false,
}: {
  label: string;
  value: string;
  isUpper?: boolean;
}) => (
  <div className="flex justify-between items-start gap-8">
    <span className="text-sm text-gray-400 whitespace-nowrap">{label}</span>
    <span
      className={cn(
        "text-sm font-bold text-[#0c243c] text-right",
        isUpper && "uppercase",
      )}
    >
      {value}
    </span>
  </div>
);

// Helper function locally since we can't import cn easily in this specific multi-file edit context if not careful
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default SuccessModal;
