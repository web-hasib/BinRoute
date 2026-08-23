import React from "react";
import { Clock, Phone, MapPin } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-[#0B132B] text-slate-300 py-2 text-xs border-b border-slate-800">
      <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-200">
            Next-Day Roll-Off Delivery Available Across Central MA
          </span>
          <span className="hidden md:inline text-slate-700">•</span>
          <div className="hidden md:flex items-center gap-1 text-slate-400 text-[11px]">
            <Clock className="size-3 text-slate-400" />
            <span>Mon–Fri 8AM–5PM, Sat 8AM–12PM</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Phone className="size-3 text-sky-400" />
            <a
              href="tel:774-622-1884"
              className="text-slate-200 hover:text-white font-bold transition-colors"
            >
              (774) 622-1884
            </a>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="size-3 text-sky-400" />
            <span>Worcester, MA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
