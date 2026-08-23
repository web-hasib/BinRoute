"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SettingsTabs = () => {
    const pathname = usePathname();

    const tabs = [
        { label: "Admin Info", href: "/dashboard/settings" },
        { label: "Admin Management", href: "/dashboard/settings/management" },
    ];

    return (
        <div className="flex items-center bg-[#F8FAFC] border border-gray-100 p-1 w-fit rounded-none mb-10">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "px-8 py-2.5 text-sm font-bold transition-all rounded-none",
                            isActive 
                                ? "bg-white text-[#172C41] shadow-[0_2px_10px_rgba(0,0,0,0.05)]" 
                                : "text-gray-400 hover:text-[#172C41]"
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
};

export default SettingsTabs;
