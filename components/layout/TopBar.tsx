import React from "react";
import { Clock, Phone, MapPin } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-[#EBEBEB] py-2 text-[10px] md:text-xs lg:text-sm border-b border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            Operating Hours : Monday-Friday 8AM-5PM, Saturday 8AM-12PM
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-gray-400 pr-4 h-full last:border-0 last:pr-0">
            <Phone className="w-4 h-4" />
            <a
              href="tel:774-622-1884"
              className="hover:text-blue-600 transition-colors"
            >
              774-622-1884
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Worcester MA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
