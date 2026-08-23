"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { TrendingUp, Users, UserCheck, Briefcase } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingStatistics } from "@/components/dashboard/BookingStatistics";
import { DriverStatus } from "@/components/dashboard/DriverStatus";
import { RecentBookingTable } from "@/components/dashboard/RecentBookingTable";
import { useGetDashboardStatsQuery } from "@/redux/api/adminDashboard/analysisApi";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const { data: statsData, isLoading } = useGetDashboardStatsQuery({ period });

  const stats = statsData?.data || {
    totalRevenue: 0,
    totalCustomers: 0,
    totalDrivers: 0,
    activeWork: 0,
    serviceBooking: {
      totalOrders: 0,
      commercial: { count: 0, percentage: 0 },
      rollOff: { count: 0, percentage: 0 }
    },
    driverStatus: {
      drivers: [],
      summary: { online: 0, offline: 0, inRoute: 0, total: 0 }
    }
  };

  const periodOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" }
  ];

  return (
    <Container>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Welcome back, Tomas Diko 👋</h1>
          <p className="text-sm text-[#666666]">Manage your roll-off dumpster services, track waste operations, and handle</p>
        </div>
        <div className="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-none">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value as any)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium transition-all rounded-none",
                period === option.value 
                  ? "bg-[#0062FF] text-white shadow-sm" 
                  : "text-[#666666] hover:text-[#1A1A1A]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
        <StatCard 
          label="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          iconBgColor="bg-green-50" 
          iconColor="text-green-600"
          isLoading={isLoading}
        />
        <StatCard 
          label="Total Customer" 
          value={stats.totalCustomers.toString()} 
          icon={Users} 
          iconBgColor="bg-blue-50" 
          iconColor="text-blue-600"
          isLoading={isLoading}
        />
        <StatCard 
          label="Total Driver" 
          value={stats.totalDrivers.toString()} 
          icon={UserCheck} 
          iconBgColor="bg-purple-50" 
          iconColor="text-purple-600"
          isLoading={isLoading}
        />
        <StatCard 
          label="Active Work" 
          value={stats.activeWork.toString()} 
          icon={Briefcase} 
          iconBgColor="bg-red-50" 
          iconColor="text-red-600"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-8">
        <div className="lg:col-span-2 h-full">
          <RevenueChart />
        </div>
        <div className="space-y-4">
          <BookingStatistics stats={stats.serviceBooking} />
          <DriverStatus data={stats.driverStatus} />
        </div>
      </div>

      <div className="mb-8">
        <RecentBookingTable />
      </div>
    </Container>
  );
}
