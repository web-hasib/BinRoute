import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export const StatCard = ({ label, value, icon: Icon, iconBgColor, iconColor }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-none border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#666666] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
      </div>
      <div className={`p-3 rounded-none ${iconBgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  );
};
