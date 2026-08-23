import React from "react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-3.5 p-4 bg-[#F8FAFC] rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-150 group">
      <div className="shrink-0 flex items-center justify-center size-8.5 bg-white border border-slate-200 rounded-md group-hover:bg-[#0060AF] group-hover:text-white group-hover:border-[#004D8C] transition-colors text-slate-700 mt-0.5 shadow-2xs">
        <Icon className="size-4 transition-colors" />
      </div>
      <div>
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 leading-tight group-hover:text-[#0060AF] transition-colors">
          {title}
        </h4>
        <p className="text-slate-600 leading-relaxed text-xs">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
