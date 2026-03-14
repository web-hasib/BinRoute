"use client";

import React, { useState } from "react";
import { Download, RefreshCw, Calendar, AlertCircle, FileText, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const allRequests = Array.from({ length: 15 }, (_, i) => ({
  id: `#INV-${88321 + i}`,
  type: ["Change Frequency", "Reschedule Pickup", "Report Damage", "Missing schedule"][i % 4],
  amount: "$245.00",
  status: i < 3 ? "Pending" : "Complete",
  date: "Aug 01, 2024",
}));

const ServiceRequestsPage = () => {
  const [sortBy, setSortBy] = useState("All");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172C41]">Service Schedule Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track your dumpster rental service operations.
          </p>
        </div>
        <Button variant="outline" className="text-[#0061AA] border-[#0061AA]/20 bg-[#E6F4FC] hover:bg-blue-100 rounded-none h-11 px-6 font-semibold">
          Missing schedule report
        </Button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Change Frequency", icon: RefreshCw, desc: "Update weekly or bi-weekly cycles" },
          { title: "Reschedule Pickup", icon: Calendar, desc: "Modify your existing pickup time" },
          { title: "Report Damage", icon: AlertCircle, desc: "Container repair or replacement request" },
        ].map((action, idx) => (
          <div key={idx} className="bg-white p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="p-4 bg-gray-50 mb-4 border border-gray-50">
              <action.icon className="size-6 text-[#172C41]" />
            </div>
            <h3 className="font-bold text-[#172C41] mb-1">{action.title}</h3>
            <p className="text-gray-400 text-xs mb-6 px-4">{action.desc}</p>
            <Button className="w-full bg-[#E6F0F9] hover:bg-blue-100 text-[#0061AA] py-6 rounded-none font-bold border-none shadow-none">
              Request now
            </Button>
          </div>
        ))}
      </div>

      {/* Request History Table */}
      <div className="bg-white p-8 rounded-none shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#172C41]">Request History</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">Sort by :</span>
            <div className="relative group">
              <button className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 border border-gray-100 cursor-pointer">
                <span className="text-[#172C41] font-bold text-[10px] uppercase">{sortBy}</span>
                <ChevronDown className="size-3 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-y border-gray-100">
                <th className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider">Requests type</th>
                <th className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-gray-400 font-bold text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allRequests.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-6 text-[#172C41] font-bold text-sm">{req.id}</td>
                  <td className="px-6 py-6 text-gray-500 font-medium text-sm">{req.type}</td>
                  <td className="px-6 py-6 text-[#172C41] font-bold text-sm">{req.amount}</td>
                  <td className="px-6 py-6">
                    <span className={cn(
                      "inline-block px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-wider",
                      req.status === "Complete" ? "bg-green-50 text-green-500" : "bg-orange-50 text-orange-400"
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-gray-500 font-medium text-sm">{req.date}</td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#006CF9] transition-colors cursor-pointer">
                      <Download className="size-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestsPage;