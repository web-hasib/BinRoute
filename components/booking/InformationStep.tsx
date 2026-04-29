"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import { updateBookingData, updateContactInfo } from "@/feature/user/bookingSlice";
import PricingSidebar from "./PricingSidebar";
import { cn } from "@/lib/utils";

interface InformationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const businessTypes = [
  "Commercial Office Building",
  "Schools",
  "Supermarkets",
  "Manufacturing",
  "Medical Facilities",
  "Restaurants Full Service",
  "Warehouse",
  "Other",
];

const wasteTypes = ["Trash", "Recycle"];

const serviceFrequencies = [
  "1x/week",
  "2x/week",
  "3x/week",
  "4x/week",
  "5x/week",
  "6x/week",
  "7x/week",
  "Every other week",
  "Once a month",
  "Twice a month",
];

const serviceDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const contractDurations = ["1 year", "2 year", "3 year"];

const InformationStep = ({ onNext, onBack }: InformationStepProps) => {
  const dispatch = useDispatch();
  const booking = useSelector((state: RootState) => state.booking);
  const { contactInfo, serviceType } = booking;

  const isCommercial = serviceType === "commercial";

  const handleInputChange = (field: string, value: any) => {
    dispatch(updateBookingData({ [field]: value }));
  };

  const handleDayToggle = (day: string) => {
    const currentDays = booking.serviceDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    handleInputChange("serviceDays", newDays);
  };

  const handleContactChange = (field: string, value: string) => {
    dispatch(updateContactInfo({ [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Forms */}
      <div className="lg:col-span-8 space-y-6">
        {/* Schedule Details */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-8">Schedule Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {/* Drop-off Address */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Dumpster Drop-off Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={isCommercial ? "150 Cambridge St Boston, MA 02114" : "Enter full address..."}
                  value={booking.dropOffAddress}
                  onChange={(e) => handleInputChange("dropOffAddress", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
              </div>
            </div>

            {/* Dates */}
            <div className={cn("space-y-2", isCommercial && "md:col-span-2")}>
              <label className="text-sm font-semibold text-[#0c243c]">
                Dempster Drop-off Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={booking.dropOffDate}
                  onChange={(e) => handleInputChange("dropOffDate", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                {!booking.dropOffDate && (
                  <Calendar className="absolute hidden right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                )}
              </div>
            </div>

            {!isCommercial && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0c243c]">Dempster Pick-up Date</label>
                <div className="relative">
                  <input
                    type="date"
                    min={booking.dropOffDate || new Date().toISOString().split("T")[0]}
                    value={booking.pickUpDate}
                    onChange={(e) => handleInputChange("pickUpDate", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                  />
                  {!booking.pickUpDate && (
                    <Calendar className="absolute hidden right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>
            )}

            {/* Business & Waste Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Business Type</label>
              <div className="relative">
                <select
                  value={booking.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none appearance-none"
                >
                  <option value="">Select Business Type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Waste Type</label>
              <div className="relative">
                <select
                  value={booking.wasteType}
                  onChange={(e) => handleInputChange("wasteType", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none appearance-none"
                >
                  <option value="">Select Waste Type</option>
                  {wasteTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Commercial Specific Sections */}
          {isCommercial && (
            <div className="mt-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#0c243c]">Service Frequency</label>
                <div className="grid grid-cols-3 gap-3">
                  {serviceFrequencies.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => handleInputChange("serviceFrequency", freq)}
                      className={cn(
                        "py-3 px-4 text-xs font-medium border-2 transition-all",
                        booking.serviceFrequency === freq
                          ? "border-[#0265AF] text-[#0265AF] shadow-sm bg-white"
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#E6F4EA] p-4 border border-[#D1E7D6]">
                <p className="text-[11px] text-[#1E7E34] leading-relaxed">
                  <span className="font-bold">Note:</span> Pricing depends on container size and pickup frequency. Additional charges may apply for weight, materials, or extended service areas.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#0c243c]">Select Contract Duration</h4>
                <div className="grid grid-cols-3 gap-3">
                  {contractDurations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => handleInputChange("contractDuration", duration)}
                      className={cn(
                        "py-3 px-4 text-xs font-medium border-2 transition-all",
                        booking.contractDuration === duration
                          ? "border-[#0265AF] text-[#0265AF] shadow-sm bg-white"
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#0c243c]">Select New Service Days</h4>
                <div className="grid grid-cols-7 gap-2">
                  {serviceDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={cn(
                        "py-3 px-1 text-[10px] font-medium border transition-all text-center",
                        booking.serviceDays?.includes(day)
                          ? "border-[#0265AF] text-[#0265AF] bg-[#EBF6FF]"
                          : "border-gray-100 text-gray-400 hover:border-gray-200"
                      )}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-8">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">First Name</label>
              <input
                type="text"
                placeholder={isCommercial ? "Miller" : "Cooper"}
                value={contactInfo.firstName}
                onChange={(e) => handleContactChange("firstName", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Last name</label>
              <input
                type="text"
                placeholder={isCommercial ? "Robert" : "Warren"}
                value={contactInfo.lastName}
                onChange={(e) => handleContactChange("lastName", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Email Address</label>
              <input
                type="email"
                placeholder={isCommercial ? "robert@example.com" : "nevaeh.simmons@example.com"}
                value={contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Phone Number</label>
              <input
                type="text"
                placeholder={isCommercial ? "(555) 123-4567" : "703 123 214"}
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Company Name (Optional)</label>
              <input
                type="text"
                placeholder={isCommercial ? "Miller Construction LLC" : "Enter your company name..."}
                value={contactInfo.companyName}
                onChange={(e) => handleContactChange("companyName", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">
                {isCommercial ? "Note (Optional)" : "Delivery Instructions"}
              </label>
              <textarea
                placeholder={isCommercial ? "Enter any special requests or instructions here." : "Enter any special requests or instructions here..."}
                rows={4}
                value={contactInfo.deliveryInstructions}
                onChange={(e) => handleContactChange("deliveryInstructions", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar */}
      <div className="lg:col-span-4">
        <PricingSidebar 
           buttonText={isCommercial ? "Continue Booking" : "Confirm Booking"}
           onButtonClick={onNext}
        />
      </div>
    </div>
  );
};

export default InformationStep;
