import React from "react";

export interface DumpTruckIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
}

export const DumpTruckIcon: React.FC<DumpTruckIconProps> = ({
  size = 24,
  className = "",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Dump Bed (Tilting Open-Box Container) */}
      <path d="M1.5 5.5L4.5 14H14V5.5H1.5Z" />

      {/* Hydraulic Lift Hinge / Support */}
      <path d="M6 14L4.5 17.5" />

      {/* Truck Cab & Windshield */}
      <path d="M15.5 17.5V7.5C15.5 7.5 17.5 7.5 19.5 11C20.5 11 22 11.5 22.5 13.5V17.5H19.5" />
      <path d="M15.5 11.5H19.2" />

      {/* Chassis Rails */}
      <path d="M1.5 17.5H4" />
      <path d="M9 17.5H15" />

      {/* Rear & Front Wheels */}
      <circle cx="6.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </svg>
  );
};

export default DumpTruckIcon;
