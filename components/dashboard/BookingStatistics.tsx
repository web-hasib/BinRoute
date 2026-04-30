"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface BookingStatsProps {
  stats: {
    totalOrders: number;
    commercial: { count: number; percentage: number };
    rollOff: { count: number; percentage: number };
  };
}

export const BookingStatistics = ({ stats }: BookingStatsProps) => {
  const data = [
    { name: "Roll-off services", value: stats?.rollOff?.percentage || 0, color: "#F97316" },
    { name: "Commercial services", value: stats?.commercial?.percentage || 0, color: "#0062FF" },
  ];

  return (
    <div className="bg-white p-6 rounded-none border border-gray-100">
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">Service booking Statistics</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col gap-4 flex-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-start gap-3">
              <div 
                className="w-3 h-3 rounded-full mt-1.5 shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-sm font-bold text-[#1A1A1A]">{item.value.toFixed(2)}%</p>
                <p className="text-sm text-[#999999]">{item.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-[180px] w-[180px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-[#1A1A1A]">{stats?.totalOrders || 0}</span>
            <span className="text-[10px] text-[#999999] uppercase font-medium">Total Order</span>
          </div>
        </div>
      </div>
    </div>
  );
};
