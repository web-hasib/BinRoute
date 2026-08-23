import { cn } from "@/lib/utils";
import React from "react";

interface StatusBadgeProps {
  status: string;  
  type?: "green" | "blue" | "gray" | "red";
  className?: string;
}

export const StatusBadge = ({ status, type = "green", className }: StatusBadgeProps) => {
  const styles = {
    green: "bg-[#D8F1D9] text-[#2D6A4F]",
    blue: "bg-[#E0F2FE] text-[#0369A1]",
    gray: "bg-[#F3F4F6] text-[#374151]",
    red: "bg-red-50 text-red-600",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-none text-xs font-medium",
      styles[type],
      className
    )}>
      {status}
    </span>
  );
};
