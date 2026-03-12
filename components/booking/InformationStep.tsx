"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateBookingData, updateContactInfo } from "@/feature/user/bookingSlice";
import PricingSidebar from "./PricingSidebar";

interface InformationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const InformationStep = ({ onNext, onBack }: InformationStepProps) => {
  const dispatch = useDispatch();
  const booking = useSelector((state: RootState) => state.booking);
  const { contactInfo } = booking;

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateBookingData({ [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    dispatch(updateContactInfo({ [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Forms */}
      <div className="lg:col-span-8 space-y-6">
        {/* Drop-off Schedule */}
        <div className="bg-white p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#0c243c] mb-6">Dumpster Drop-off Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dumpster Drop-off Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter full address..."
                  value={booking.dropOffAddress}
                  onChange={(e) => handleInputChange("dropOffAddress", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Drop-off Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={booking.dropOffDate}
                  onChange={(e) => handleInputChange("dropOffDate", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Waste Pick-up Schedule */}
        <div className="bg-white p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#0c243c] mb-6">Waste Pick-up Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Waste Pick-up Address</label>
              <input
                type="text"
                placeholder="Enter full address..."
                value={booking.pickUpAddress}
                onChange={(e) => handleInputChange("pickUpAddress", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Drop-off Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={booking.pickUpDate}
                  onChange={(e) => handleInputChange("pickUpDate", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Business Type</label>
              <div className="relative">
                <select
                  value={booking.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none appearance-none"
                >
                  <option value="">Select Business Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Waste Type</label>
              <div className="relative">
                <select
                  value={booking.wasteType}
                  onChange={(e) => handleInputChange("wasteType", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none appearance-none"
                >
                  <option value="">Select Waste Type</option>
                  <option value="general">General Waste</option>
                  <option value="concrete">Concrete/Bricks</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-[#0c243c] mb-6">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={contactInfo.firstName}
                onChange={(e) => handleContactChange("firstName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={contactInfo.lastName}
                onChange={(e) => handleContactChange("lastName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="robert@example.com"
                value={contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name (Optional)</label>
              <input
                type="text"
                placeholder="Enter your company name..."
                value={contactInfo.companyName}
                onChange={(e) => handleContactChange("companyName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Delivery Instructions</label>
              <textarea
                placeholder="Enter any special requests or instructions here..."
                rows={4}
                value={contactInfo.deliveryInstructions}
                onChange={(e) => handleContactChange("deliveryInstructions", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar */}
      <div className="lg:col-span-4">
        <PricingSidebar 
           buttonText="Confirm Booking"
           onButtonClick={onNext}
        />
      </div>
    </div>
  );
};

export default InformationStep;
