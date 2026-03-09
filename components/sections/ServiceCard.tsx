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
    <div className="flex items-start gap-5 p-6 bg-[#f7f8f9] rounded-none border-l-4 border-transparent hover:border-[#1f74ba] transition-all group">
      <div className="shrink-0 flex items-center justify-center size-10 bg-white shadow-xs border border-gray-100 rounded-none">
        <Icon className="size-5 text-gray-600 group-hover:text-[#1f74ba] transition-colors" />
      </div>
      <div>
        <h3 className="text-[1.35rem] font-bold text-[#0c243c] mb-1.5 leading-tight">
          {title}
        </h3>
        <p className="text-[#5a6b7d] leading-[1.6] text-[0.95rem]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
