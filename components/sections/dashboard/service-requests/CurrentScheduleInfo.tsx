"use client";

import React from "react";
import { Calendar } from "lucide-react";

const CurrentScheduleInfo = () => {
  return (
    <div className="bg-white border border-gray-100 p-8">
      <h3 className="text-sm font-bold text-[#172C41] mb-6">Current Schedule</h3>
      <div className="bg-[#F8F9FA] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border border-gray-100 shadow-sm">
            <Calendar className="size-5 text-[#172C41]" />
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Commercial Schedule</p>
            <p className="text-[#172C41] font-bold text-base">1x Per Month</p>
          </div>
        </div>
        <div className="text-right">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Monday</p>
            <p className="text-[#172C41] font-bold text-base">2 Yard Dumpster</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentScheduleInfo;
