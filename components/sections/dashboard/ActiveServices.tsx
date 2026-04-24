"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const services = [
    {
        id: 1,
        title: "Roll of dumpster booking Service",
        details: "10 Yard Dumpster",
        duration: "1 month ( 1 May, 2026 - 30 May 2026 )",
        image: "/dummy-dumpster.png" // Placeholder
    },
    {
        id: 2,
        title: "Commercial dumpster booking Service",
        details: "2 Yard Dumpster",
        duration: "1x Per Week",
        image: "/dummy-dumpster-2.png" // Placeholder
    }
];

const ActiveServices = () => {
    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#172C41] mb-1">
                        Welcome back, Tomas Diko 👋
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Manage your roll-off dumpster services, track waste operations, and handle billing details.
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-[#172C41] font-bold text-lg">Active Service (2)</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {services.map((service) => (
                    <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-gray-50 border border-gray-100 rounded-none gap-4">
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-16 bg-white rounded-none p-2 border border-gray-100">
                                <Image
                                    src="/dummy.png" // Using project dummy image
                                    alt={service.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-[#172C41] font-bold text-lg">{service.title}</h3>
                                <p className="text-gray-500 text-sm mt-1">{service.details}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{service.duration}</p>
                            </div>
                        </div>
                        <Button className="bg-[#0061AA] hover:bg-[#003865] text-white font-semibold rounded-none px-8 py-6">
                            View Schedule
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveServices;
