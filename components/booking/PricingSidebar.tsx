"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PricingSidebarProps {
  buttonText: string;
  onButtonClick: () => void;
}

const PricingSidebar = ({ buttonText, onButtonClick }: PricingSidebarProps) => {
  const { dumpsterSize, pricing } = useSelector((state: RootState) => state.booking);

  return (
    <div className="space-y-6 sticky top-24">
      {/* Title Card */}
      <div className="bg-[#0c243c] p-6 text-white">
        <h3 className="text-xl font-bold">Transparent Roll-Off Pricing</h3>
        <p className="text-xs text-gray-400 mt-1">Distance-Based Pricing (From 103 Creeper Rd, Grafton, MA)</p>
      </div>

      {/* Map/Distance Card */}
      <div className="bg-white border border-gray-100 p-1 space-y-4">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
           <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
             <p className="transform -rotate-30 text-xl font-bold text-red-400 text-center px-4 drop-shadow-md">
               here will be the map later
             </p>
           </div>
           {/* Mock Map Image */}
           <Image src="/dummy.png" alt="Map" fill className="object-cover" />
           <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 text-[10px] font-bold">
             <MapPin className="w-3 h-3 text-[#0265AF]" />
             <span>103 Creeper Rd</span>
           </div>
        </div>
        <div className="flex items-center gap-3 p-4">
           <div className="p-2 bg-gray-50">
             <MapPin className="w-5 h-5 text-[#0c243c]" />
           </div>
           <div>
             <h4 className="text-sm font-bold">0.0 Miles</h4>
             <p className="text-[10px] text-gray-500">Calculated Distance</p>
           </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#E6F4EA] p-4 text-[#1E7E34] text-[11px] leading-relaxed">
         Note: Delivery distance charges apply automatically: +$100 for 30-60 miles and +$150 for over 60 miles.
      </div>

      {/* Details Card */}
      <div className="bg-white border border-gray-100 p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
          <span className="text-xs text-gray-500">Dumpster Size</span>
          <span className="text-xs font-bold text-[#0c243c] uppercase">{dumpsterSize?.replace("-", " ")}</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-[#0c243c]">${pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Environmental Tax (6%)</span>
            <span className="font-bold text-[#0c243c]">${pricing.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service Area Fee</span>
            <span className="font-bold text-[#0c243c]">${pricing.fee.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
           <span className="text-lg font-bold text-[#0c243c]">Total amount</span>
           <span className="text-lg font-bold text-[#0c243c]">${pricing.total.toFixed(2)}</span>
        </div>

        <Button 
          onClick={onButtonClick}
          className="w-full bg-[#0265AF] hover:bg-[#004d85] text-white py-6 rounded-none font-bold"
        >
          {buttonText}
        </Button>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          By clicking &quot;{buttonText}&quot;, you agree to our <span className="text-[#0265AF] underline">Terms of Service</span> and Rental Agreement. This rental is non-refundable once dispatched.
        </p>
      </div>
    </div>
  );
};

export default PricingSidebar;
