import Container from "@/components/ui/container";
import { TrendingUp, Users, UserCheck, Briefcase } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingStatistics } from "@/components/dashboard/BookingStatistics";
import { DriverStatus } from "@/components/dashboard/DriverStatus";
import { RecentBookingTable } from "@/components/dashboard/RecentBookingTable";

export default function DashboardOverview() {
  return (
    <Container>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Welcome back, Tomas Diko 👋</h1>
          <p className="text-sm text-[#666666]">Manage your roll-off dumpster services, track waste operations, and handle</p>
        </div>
        <div className="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-none">
          <button className="px-4 py-1.5 text-sm font-medium bg-[#0062FF] text-white rounded-none shadow-sm transition-all">Weekly</button>
          <button className="px-4 py-1.5 text-sm font-medium text-[#666666] hover:text-[#1A1A1A] transition-all">Monthly</button>
          <button className="px-4 py-1.5 text-sm font-medium text-[#666666] hover:text-[#1A1A1A] transition-all">Yearly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
        <StatCard 
          label="Total Revenue" 
          value="$12,3620" 
          icon={TrendingUp} 
          iconBgColor="bg-green-50" 
          iconColor="text-green-600"
        />
        <StatCard 
          label="Total Customer" 
          value="1200" 
          icon={Users} 
          iconBgColor="bg-blue-50" 
          iconColor="text-blue-600"
        />
        <StatCard 
          label="Total Driver" 
          value="50" 
          icon={UserCheck} 
          iconBgColor="bg-purple-50" 
          iconColor="text-purple-600"
        />
        <StatCard 
          label="Active Work" 
          value="20" 
          icon={Briefcase} 
          iconBgColor="bg-red-50" 
          iconColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-8">
        <div className="lg:col-span-2 h-full">
          <RevenueChart />
        </div>
        <div className="space-y-4">
          <BookingStatistics />
          <DriverStatus />
        </div>
      </div>

      <div className="mb-8">
        <RecentBookingTable />
      </div>
    </Container>
  );
}
