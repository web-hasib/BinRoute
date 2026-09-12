"use client";

import React from "react";
import Image from "next/image";
import { LayoutDashboard, Calendar, History, CreditCard, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard/user", active: false },
    { title: "Service Schedule", icon: Calendar, href: "/dashboard/user/schedule", active: false },
    { title: "Payment History", icon: History, href: "/dashboard/user/payment-history", active: false },
    { title: "Billing & Payment", icon: CreditCard, href: "#" },
    { title: "Service Requests", icon: FileText, href: "#" },
];


import { usePathname } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/auth/authApi";

const UserSidebar = () => {
    const pathname = usePathname();
    const { data: userResponse } = useGetMeQuery(undefined);
    const userName = userResponse?.data?.fullName || userResponse?.data?.name || "User";
    const userEmail = userResponse?.data?.email || "";
    const avatarUrl = userResponse?.data?.profileImage || userResponse?.data?.image || "/dummy.png";

    return (
        <div className="flex flex-col gap-6 w-full max-w-[300px]">
            {/* Profile Card */}
            <div className="bg-white p-8 rounded-none shadow-sm flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-4">
                    <Image
                        src={avatarUrl}
                        alt={userName}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <h2 className="text-xl font-bold text-[#172C41]">{userName}</h2>
                {userEmail && <p className="text-gray-500 text-sm mb-6 truncate max-w-[200px]">{userEmail}</p>}
                <Button variant="outline" className="w-full rounded-none border-gray-200 text-gray-600 font-medium hover:bg-gray-50">
                    Edit Profile
                </Button>
            </div>

            {/* Navigation Card */}
            <div className="bg-white py-4 rounded-none shadow-sm overflow-hidden">
                <nav className="flex flex-col">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <a
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 text-sm font-medium transition-colors border-l-4",
                                    isActive
                                        ? "bg-blue-50 text-[#006CF9] border-[#006CF9]"
                                        : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className="size-5" />
                                {item.title}
                            </a>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};


export default UserSidebar;
