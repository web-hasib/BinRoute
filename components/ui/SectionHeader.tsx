import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
  badgeClassName?: string;
  titleClassName?: string;
  maxWidth?: string;
}

const SectionHeader = ({
  badge,
  title,
  subtitle,
  className,
  badgeClassName,
  titleClassName,
  maxWidth = "max-w-3xl",
}: SectionHeaderProps) => {
  return (
    <div className={cn("text-center mb-12 md:mb-16", className)}>
      {badge && (
        <span
          className={cn(
            "block text-xs font-bold uppercase text-[#0060AF] mb-2",
            badgeClassName
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-[1.18] mx-auto",
          maxWidth,
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
