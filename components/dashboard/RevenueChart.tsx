"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { name: "Mon", thisMonth: 60, lastMonth: 80 },
  { name: "Tue", thisMonth: 65, lastMonth: 50 },
  { name: "Wed", thisMonth: 55, lastMonth: 60 },
  { name: "Thu", thisMonth: 70, lastMonth: 45 },
  { name: "Fri", thisMonth: 48, lastMonth: 58 },
  { name: "Sat", thisMonth: 82, lastMonth: 42 },
  { name: "Sun", thisMonth: 52, lastMonth: 55 },
];

export const RevenueChart = () => {
  return (
    <div className="bg-white p-6 rounded-none border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-[#1A1A1A]">Revenue Performance</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-none border border-blue-100">
          May, 2026
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              tickFormatter={(value: number) => `${value}k`}
              domain={[0, 150]}
              ticks={[0, 20, 40, 60, 80, 100, 120, 140, 150]}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                padding: '12px'
              }}
            />
            <ReferenceLine x="Thu" stroke="#999999" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="thisMonth" 
              stroke="#0062FF" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: "#0062FF", strokeWidth: 2, stroke: "#fff" }}
            />
            <Line 
              type="monotone" 
              dataKey="lastMonth" 
              stroke="#F97316" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: "#F97316", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
