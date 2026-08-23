import { cn } from "@/lib/utils";
import React from "react";

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  isLast?: boolean;
  valueClassName?: string;
}

export const DetailRow = ({ label, value, className, isLast = false, valueClassName }: DetailRowProps) => {
  return (
    <div className={cn(
      "flex justify-between items-center py-5 px-6 animate-in fade-in slide-in-from-top-1 duration-500",
      !isLast && "border-b border-gray-100",
      className
    )}>
      <span className="text-[14px] font-medium text-[#71717A]">{label}</span>
      <span className={cn("text-[14px] font-bold text-[#18181B]", valueClassName)}>{value}</span>
    </div>
  );
};
