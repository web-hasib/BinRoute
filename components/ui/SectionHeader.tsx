import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge: string;
  title: string | React.ReactNode;
  className?: string;
  badgeClassName?: string;
  titleClassName?: string;
  maxWidth?: string;
}

const SectionHeader = ({
  badge,
  title,
  className,
  badgeClassName,
  titleClassName,
  maxWidth = "max-w-4xl",
}: SectionHeaderProps) => {
  return (
    <div className={cn("text-center mb-16 md:mb-20", className)}>
      <span
        className={cn(
          "inline-block px-4 py-1.5 text-[#4a607d] text-[0.7rem] font-bold uppercase tracking-widest border border-[#E5E9EB] rounded-none mb-6",
          badgeClassName,
        )}
      >
        {badge}
      </span>
      <h2
        className={cn(
          "text-4xl md:text-[3rem] font-bold text-[#172c41e9] tracking-tight leading-[1.1] mx-auto",
          maxWidth,
          titleClassName,
        )}
      >
        {title}
      </h2>
    </div>
  );
};

export default SectionHeader;
