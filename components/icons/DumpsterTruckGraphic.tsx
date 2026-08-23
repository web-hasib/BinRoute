import React from "react";

export interface DumpsterTruckGraphicProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  withBadge?: boolean;
}

export const DumpsterTruckGraphic: React.FC<DumpsterTruckGraphicProps> = ({
  size = 48,
  className = "",
  withBadge = false,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="truckBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0060AF" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="truckBinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00529C" />
          <stop offset="100%" stopColor="#002D54" />
        </linearGradient>

        <linearGradient id="truckCabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <radialGradient id="truckWheelGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="60%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>

        <radialGradient id="truckRimGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>

        <filter id="truckShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#001833" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Optional Circular Badge Backdrop */}
      {withBadge && (
        <circle cx="64" cy="64" r="60" fill="url(#truckBgGrad)" />
      )}

      {/* Shadow */}
      <ellipse cx="64" cy="98" rx="46" ry="7" fill="#000000" opacity="0.18" filter="blur(3px)" />

      {/* Chassis Rails */}
      <rect x="18" y="78" width="88" height="6" rx="2" fill="#334155" />
      <rect x="22" y="82" width="18" height="5" rx="1" fill="#475569" />
      <rect x="52" y="82" width="22" height="5" rx="1" fill="#475569" />

      {/* Hoist Arm */}
      <path d="M22 79 L42 66 L44 68 L24 81 Z" fill="#64748B" />
      <circle cx="23" cy="80" r="2" fill="#94A3B8" />
      <circle cx="43" cy="67" r="2" fill="#94A3B8" />

      {/* Dumpster Bin */}
      <g filter="url(#truckShadow)">
        <path d="M14 44 L20 76 L74 76 L76 44 Z" fill="url(#truckBinGrad)" />
        <path d="M12 42 L78 42 L77 46 L13 46 Z" fill="#0060AF" />
        <line x1="28" y1="46" x2="31" y2="76" stroke="#0060AF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="46" x2="46" y2="76" stroke="#0060AF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="46" x2="61" y2="76" stroke="#0060AF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M74 44 L80 44 L78 49 L74 49 Z" fill="#0284C7" />
        <circle cx="17" cy="77" r="2.5" fill="#94A3B8" />
        <circle cx="17" cy="77" r="1" fill="#475569" />
      </g>

      {/* Truck Cab */}
      <g filter="url(#truckShadow)">
        <path d="M78 52 L94 52 C98 52 101 55 103 59 L109 68 C110.5 70.5 111 72.5 111 75 L111 82 C111 83.5 110 84.5 108.5 84.5 L78 84.5 Z" fill="url(#truckCabGrad)" />
        <rect x="106" y="80" width="7" height="4.5" rx="1.5" fill="#334155" />
        <rect x="109" y="81" width="3.5" height="2" rx="0.5" fill="#E2E8F0" />
        <path d="M109 75.5 L111 75.5 L111 78.5 L108.5 78.5 Z" fill="#FACC15" />
        <circle cx="109.5" cy="77" r="1" fill="#FEF08A" />
        <path d="M82 56 L94 56 C96.5 56 98.5 58 100 61 L104 68 L82 68 Z" fill="#0284C7" opacity="0.85" />
        <path d="M84 58 L93 58 L98 66 L84 66 Z" fill="#38BDF8" opacity="0.4" />
        <line x1="82" y1="69" x2="82" y2="82" stroke="#94A3B8" strokeWidth="1.2" />
        <line x1="97" y1="69" x2="97" y2="82" stroke="#94A3B8" strokeWidth="1.2" />
        <rect x="85" y="72" width="3.5" height="1.2" rx="0.6" fill="#475569" />
        <rect x="100.5" y="62" width="2" height="6" rx="0.8" fill="#1E293B" />
        <rect x="80" y="82" width="16" height="2" fill="#64748B" />
      </g>

      {/* Wheels */}
      <g>
        <circle cx="32" cy="85" r="11" fill="url(#truckWheelGrad)" />
        <circle cx="32" cy="85" r="7" fill="url(#truckRimGrad)" />
        <circle cx="32" cy="85" r="3" fill="#334155" />
        <circle cx="32" cy="85" r="1" fill="#FFFFFF" />
      </g>
      <g>
        <circle cx="56" cy="85" r="11" fill="url(#truckWheelGrad)" />
        <circle cx="56" cy="85" r="7" fill="url(#truckRimGrad)" />
        <circle cx="56" cy="85" r="3" fill="#334155" />
        <circle cx="56" cy="85" r="1" fill="#FFFFFF" />
      </g>
      <g>
        <circle cx="98" cy="85" r="11" fill="url(#truckWheelGrad)" />
        <circle cx="98" cy="85" r="7" fill="url(#truckRimGrad)" />
        <circle cx="98" cy="85" r="3" fill="#334155" />
        <circle cx="98" cy="85" r="1" fill="#FFFFFF" />
      </g>

      {/* Highlights */}
      <path d="M14 44 L76 44 L70 52 L16 52 Z" fill="#FFFFFF" opacity="0.12" />
    </svg>
  );
};

export default DumpsterTruckGraphic;
