"use client";

import React from "react";
import { MapPin, Navigation, Info, ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface InformationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const InformationStep = ({ onNext, onBack }: InformationStepProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Left Column: Forms */}
      <div className="lg:col-span-2 space-y-8">
        {/* Schedule Details */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-6">Schedule Details</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Dumpster Drop-off Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  defaultValue="150 Cambridge St Boston, MA 02114"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Dempster Drop-off Date</label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  defaultValue="12 Dec 2026"
                  className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#0c243c] mb-2">Business Type</label>
                <div className="relative">
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-none appearance-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]">
                    <option>Home</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0c243c] mb-2">Waste Type</label>
                <div className="relative">
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-none appearance-none focus:outline-none focus:ring-1 focus:ring-[#0265AF]">
                    <option>Food waste</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Service Frequency</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["1x Per Week", "2x Per Week", "3x Per Week", "4x Per Week", "5x Per Week", "6x Per Week"].map((freq, i) => (
                  <button 
                    key={freq}
                    className={cn(
                      "py-4 border text-sm font-medium transition-all rounded-none",
                      i === 0 ? "border-[#0265AF] bg-white ring-1 ring-[#0265AF] text-[#0265AF]" : "border-gray-100 text-gray-600 hover:border-gray-200"
                    )}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#F0FDF4] p-4 border border-[#DCFCE7] flex gap-3">
               <div className="bg-[#22C55E] p-0.5 rounded-full h-fit mt-0.5">
                  <Info className="w-3 h-3 text-white" />
               </div>
               <p className="text-xs text-[#15803D] leading-relaxed font-medium">
                  Note: <span className="font-normal text-gray-500">Pricing depends on container size and pickup frequency. Additional charges may apply for weight, materials, or extended service areas.</span>
               </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-6">Contact Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">First Name</label>
              <input type="text" defaultValue="Miller" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Last name</label>
              <input type="text" defaultValue="Robert" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Email Address</label>
              <input type="email" defaultValue="robert@example.com" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Phone Number</label>
              <input type="text" defaultValue="(555) 123-4567" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Company Name (Optional)</label>
              <input type="text" defaultValue="Miller Construction LLC" className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0c243c] mb-2">Waste Type</label>
              <div className="relative">
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-none appearance-none">
                  <option>Office</option>
                </select>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-[#0c243c] mb-2">Note (Optional)</label>
             <textarea 
               placeholder="Enter any special requests or instructions here."
               className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-none h-32 focus:outline-none focus:ring-1 focus:ring-[#0265AF]"
             ></textarea>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-[#0c243c] p-6 text-white">
            <h3 className="text-xl font-bold">Transparent Roll Off Pricing</h3>
            <p className="text-xs text-gray-400 mt-1 opacity-80 font-normal">Distance-Based Pricing (From 103 Creeper Rd, Grafton, MA)</p>
          </div>

          {/* Map Preview Placeholder */}
          <div className="p-4">
             <div className="relative h-[250px] bg-gray-50 border border-gray-100 mb-4 overflow-hidden group">
                <div className="absolute inset-0 bg-[#f9fafb] flex items-center justify-center pointer-events-none">
                   <div className="w-full h-full opacity-60 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:20px_20px]"></div>
                   {/* Mock markers and route */}
                   <div className="absolute top-[80px] right-[40px] flex flex-col items-center">
                      <div className="bg-white px-2 py-1 rounded shadow text-[10px] absolute -top-8 whitespace-nowrap border">103 Creeper Rd</div>
                      <div className="w-6 h-6 bg-[#0265AF] rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                          <MapPin className="w-3 h-3 text-white" />
                      </div>
                   </div>
                   <div className="absolute bottom-[80px] left-[40px] flex flex-col items-center">
                      <div className="bg-white px-2 py-1 rounded shadow text-[10px] absolute -top-8 whitespace-nowrap border">150 Cambridge</div>
                      <div className="w-6 h-6 bg-[#0265AF] rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                          <MapPin className="w-3 h-3 text-white" />
                      </div>
                   </div>
                   <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 80 30 Q 50 60 20 70" fill="none" stroke="#0265AF" strokeWidth="2" strokeDasharray="4 2" />
                   </svg>
                </div>
                
                {/* Distance Indicator */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 border border-gray-100 flex items-center gap-3">
                   <div className="bg-gray-50 p-2 border border-gray-100">
                      <Navigation className="w-4 h-4 text-gray-600" />
                   </div>
                   <div>
                      <p className="text-[14px] font-bold text-[#0c243c]">42.4 Miles</p>
                      <p className="text-[10px] text-gray-500 font-medium tracking-tight">Calculated Distance</p>
                   </div>
                </div>
             </div>

             <div className="bg-[#F0FDF4] p-4 border border-[#DCFCE7] mb-6">
                <p className="text-[10px] text-[#15803D] leading-normal font-medium">
                   Note: <span className="font-normal text-gray-600">Delivery distance charges apply automatically +$100 for 30-60 miles and +$150 for over 60 miles.</span>
                </p>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Dumpster Size</span>
                  <span className="font-bold text-[#0c243c]">2 Yard Dumpster</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Service Frequency</span>
                  <span className="font-bold text-[#0c243c]">1x Per Week</span>
               </div>
               <hr className="border-gray-100" />
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-bold text-[#0c243c]">$80</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Environmental Tax (6%)</span>
                    <span className="font-bold text-[#0c243c]">$25.50</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Service Area Fee</span>
                    <span className="font-bold text-[#0c243c]">$100</span>
                  </div>
               </div>

               <hr className="border-dashed border-gray-200 mt-6" />
               <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold text-[#0c243c]">Total amount</span>
                  <span className="text-2xl font-bold text-[#0c243c]">$205.50</span>
               </div>

               <Button 
                 onClick={onNext}
                 className="w-full bg-[#0265AF] hover:bg-[#004d85] text-white py-8 text-lg font-bold rounded-none mt-4 transition-all shadow-md active:scale-95"
               >
                 Continue Booking
               </Button>

               <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed px-4">
                  By clicking &apos;Complete Booking,&apos; you agree to our <span className="text-[#0265AF] font-bold">Terms of Service</span> and Rental Agreement. This rental is non-refundable once dispatched.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationStep;
