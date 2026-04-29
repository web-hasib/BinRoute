"use client";

import React from "react";
import { Calendar, User, Mail, Phone, MapPin, Package, Clock, Building2, TrendingUp } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { format } from "date-fns";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any | null;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const detailRows = [
    { label: "Customer Name", value: `${booking.firstName} ${booking.lastName}`, icon: User },
    { label: "Email Address", value: booking.email, icon: Mail },
    { label: "Phone Number", value: booking.phone, icon: Phone },
    { label: "Company Name", value: booking.companyName || "N/A", icon: Building2 },
    { label: "Service Address", value: booking.dropoffAddress, icon: MapPin },
    { label: "Business Type", value: booking.businessType, icon: Building2 },
    { label: "Waste Type", value: booking.wasteType, icon: Package },
    { label: "Dumpster Size", value: booking.plan?.dumpsterSize || "N/A", icon: Package },
    { label: "Container Count", value: booking.containerCount, icon: Package },
    { label: "Rental Duration", value: booking.rentalDuration || "N/A", icon: Clock },
    { label: "Total Amount", value: `$${booking.totalAmount.toLocaleString()}`, icon: TrendingUp },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={true} 
      title={`Booking Details #${booking.id.slice(-6).toUpperCase()}`}
      className="max-w-3xl"
    >
      <div className="space-y-8 pb-6">
        {/* Status Badge */}
        <div className="flex justify-end -mt-4">
            <span className={`px-4 py-1 text-xs font-bold rounded-none ${
                booking.status === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
            }`}>
                {booking.status}
            </span>
        </div>

        {/* Dates Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Drop-off Date</p>
                <div className="flex items-center gap-2 text-[#172C41] font-bold">
                    <Calendar className="w-4 h-4 text-[#0164B0]" />
                    {format(new Date(booking.dropoffDate), "dd MMM, yyyy")}
                </div>
            </div>
            <div className="bg-[#F8FAFC] p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup Date</p>
                <div className="flex items-center gap-2 text-[#172C41] font-bold">
                    <Calendar className="w-4 h-4 text-[#0164B0]" />
                    {booking.pickupDate ? format(new Date(booking.pickupDate), "dd MMM, yyyy") : "TBD"}
                </div>
            </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {detailRows.map((row, index) => (
                <div key={index} className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{row.label}</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#172C41]">
                        <row.icon className="w-4 h-4 text-gray-300" />
                        {row.value}
                    </div>
                </div>
            ))}
        </section>

        {/* Delivery Instructions */}
        {booking.deliveryInstructions && (
            <section className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Instructions</p>
                <div className="bg-gray-50 p-4 border border-gray-100 italic text-sm text-gray-600">
                    "{booking.deliveryInstructions}"
                </div>
            </section>
        )}
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
