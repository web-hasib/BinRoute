import { cn } from "@/lib/utils";
import React from "react";

interface DetailCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const DetailCard = ({ title, children, className, headerAction }: DetailCardProps) => {
  return (
    <div className={cn("bg-white rounded-none border border-gray-100 shadow-sm", className)}>
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h3 className="text-[20px] font-semibold text-[#515050]">{title}</h3>
        {headerAction}
      </div>
      <div className="p-0">
        {children}
      </div>
    </div>
  );
};
