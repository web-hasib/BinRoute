"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useGetRevenuePerformanceQuery } from "@/redux/api/adminDashboard/analysisApi";
import { cn } from "@/lib/utils";

export const RevenueChart = () => {
  const [type, setType] = useState<"7days" | "12months" | "10years">("10years");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { data: performanceData, isLoading } = useGetRevenuePerformanceQuery({ type });

  const chartData = React.useMemo(() => {
    if (!performanceData?.data) return [];
    
    const currentBreakdown = performanceData.data.current.breakdown;
    const previousBreakdown = performanceData.data.previous.breakdown;
    
    const currentKeys = Object.keys(currentBreakdown).sort();
    const previousKeys = Object.keys(previousBreakdown).sort();

    return currentKeys.map((key, index) => {
      const prevKey = previousKeys[index];
      return {
        name: key, // The year/month/day
        current: currentBreakdown[key],
        previous: previousBreakdown[prevKey] || 0,
        label: key // Could be formatted further
      };
    });
  }, [performanceData]);

  const typeOptions = [
    { label: "7 Days", value: "7days" },
    { label: "12 Months", value: "12months" },
    { label: "10 Years", value: "10years" }
  ];

  const currentLabel = typeOptions.find(opt => opt.value === type)?.label || "Select Period";

  return (
    <div className="bg-white p-6 rounded-none border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-[#1A1A1A]">Revenue Performance</h3>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-none border border-blue-100 min-w-[120px] justify-between"
          >
            {currentLabel}
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-full bg-white border border-gray-100 shadow-lg z-10">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setType(option.value as any);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                    type === option.value ? "text-blue-600 font-bold" : "text-gray-600"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400 font-sans">Loading data...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#999999', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#999999', fontSize: 12 }}
                tickFormatter={(value: number) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                dy={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '0px', 
                  border: '1px solid #E5E7EB', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                  fontFamily: 'inherit'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                name="Current Period"
                stroke="#0062FF" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: "#0062FF", strokeWidth: 2, stroke: "#fff" }}
              />
              <Line 
                type="monotone" 
                dataKey="previous" 
                name="Previous Period"
                stroke="#F97316" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: "#F97316", strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
