"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { CheckCircle2, Download, Home, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearServiceData } from "@/feature/user/bookingSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSearchParams } from "next/navigation";
import { useGetServiceAreaByIdQuery } from "@/redux/api/service-area/serviceAreaApi";
import Link from "next/link";
import { motion } from "framer-motion";

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal = ({ onClose }: SuccessModalProps) => {
  const dispatch = useDispatch();
  const { serviceType, dumpsterSize, pricing, dropOffAddress, subscriptionId, distance, contractDuration } = useSelector(
    (state: RootState) => state.booking,
  );

  const searchParams = useSearchParams();
  const areaId = searchParams.get("areaId");

  const { data: areaData } = useGetServiceAreaByIdQuery(areaId || "", {
    skip: !areaId,
  });

  const selectedPlan = areaData?.data?.plans?.find((p: any) => p.id === dumpsterSize);
  const dumpsterName = selectedPlan?.plan?.dumpsterSize ? `${selectedPlan.plan.dumpsterSize} Dumpster` : (dumpsterSize ? dumpsterSize.replace("-", " ") : "N/A");

  const handleBackToDashboard = () => {
    dispatch(clearServiceData());
    onClose();
  };

  const shortId = subscriptionId ? subscriptionId.slice(-6).toUpperCase() : "882941";
  const displayDistance = distance ? `${distance.toFixed(1)} Miles` : "N/A";
  const rentalDuration = serviceType === "roll-off" ? "7-Day Standard" : contractDuration || "1 year";

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const invoiceId = `BR-${shortId}`;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("BIN ROUTE - INVOICE RECEIPT", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Confirmation #: ${invoiceId}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
    doc.text(`Dispatch Hub: Grafton, MA (774) 622-1884`, 14, 44);

    // Address
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Drop-Off Address", 14, 56);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    const splitAddress = doc.splitTextToSize(dropOffAddress || "N/A", 180);
    doc.text(splitAddress, 14, 64);

    // Details Table
    autoTable(doc, {
      startY: 78,
      head: [["Service Description", "Details"]],
      body: [
        ["Service Type", serviceType === "commercial" ? "Commercial Dumpster" : "Roll-Off Dumpster Rental"],
        ["Container Size", dumpsterName],
        ["Delivery Distance", displayDistance],
        ["Rental Duration", rentalDuration],
      ],
      headStyles: { fillColor: [0, 96, 175] },
    });

    // Pricing Table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 12,
      head: [["Charges", "Amount"]],
      body: [
        ["Subtotal", `$${pricing.subtotal.toFixed(2)}`],
        ["Environmental Tax (6%)", `$${pricing.tax.toFixed(2)}`],
        ["Service Area Delivery Fee", `$${pricing.fee.toFixed(2)}`],
      ],
      foot: [
        ["Total Amount Paid", `$${pricing.total.toFixed(2)}`]
      ],
      headStyles: { fillColor: [15, 23, 42] },
      footStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold" },
    });

    doc.save(`Invoice_${invoiceId}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
        onClick={handleBackToDashboard}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white w-full max-w-xl p-6 sm:p-10 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="size-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600 shadow-sm">
            <CheckCircle2 className="size-9" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            Payment & Booking Confirmed
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            Your Dumpster is Scheduled!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Confirmation <strong>#BR-{shortId}</strong>. Our dispatch driver will call 30 minutes prior to arrival on delivery day.
          </p>
        </div>

        {/* Order Details */}
        <div className="mt-8 space-y-3 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100 text-xs">
          <DetailRow label="Confirmation #" value={`#BR-${shortId}`} />
          <DetailRow label="Service Type" value={serviceType === "roll-off" ? "Roll-Off Dumpster" : "Commercial Dumpster"} />
          <DetailRow label="Container Size" value={dumpsterName} isUpper />
          <DetailRow label="Rental Duration" value={rentalDuration} />
          <DetailRow label="Calculated Distance" value={displayDistance} />
          <DetailRow label="Delivery Address" value={dropOffAddress || "N/A"} />
        </div>

        {/* Price Breakdown */}
        <div className="mt-6 pt-5 border-t border-dashed border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Base Container Rental</span>
            <span className="font-bold text-slate-900">${pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Environmental Tax (6%)</span>
            <span className="font-bold text-slate-900">${pricing.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Service Area Delivery Fee</span>
            <span className="font-bold text-slate-900">${pricing.fee.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-slate-900">
          <span className="text-base font-bold">Total Paid</span>
          <span className="text-2xl font-black text-[#0060AF]">${pricing.total.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/user" className="flex-1">
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              size="lg"
              className="w-full h-12 text-xs sm:text-sm font-bold rounded-xl"
            >
              <Home className="size-4 mr-1.5" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
          <Button 
            onClick={handleDownloadInvoice}
            variant="primary"
            size="lg"
            className="flex-1 h-12 text-xs sm:text-sm font-bold rounded-xl gap-1.5 shadow-md"
          >
            <Download className="size-4" />
            <span>Download Invoice</span>
          </Button>
        </div>
      </motion.div>
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
  <div className="flex justify-between items-start gap-4">
    <span className="text-slate-500 whitespace-nowrap">{label}</span>
    <span
      className={`font-bold text-slate-900 text-right ${
        isUpper ? "uppercase" : ""
      }`}
    >
      {value}
    </span>
  </div>
);

export default SuccessModal;
