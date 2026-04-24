"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

const events = [
    {
        id: 1,
        date: "Upcoming (1 May, 2026)",
        title: "Dumpster Drop-off",
        time: "10:00 AM - 50:00 PM"
    },
    {
        id: 2,
        date: "Next (30May, 2026)",
        title: "Dumpster Pick-up",
        time: "10:00 AM - 50:00 PM"
    }
];

const ScheduleTimeline = () => {
    const [activeTab, setActiveTab] = useState("roll");

    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm h-fit">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#172C41]">Activity Timeline</h2>

                {/* Service Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-none">
                    <button
                        onClick={() => setActiveTab("roll")}
                        className={cn(
                            "px-4 py-2 text-xs font-bold transition-colors rounded-none",
                            activeTab === "roll" ? "bg-[#0061AA] text-white" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Roll of Service
                    </button>
                    <button
                        onClick={() => setActiveTab("commercial")}
                        className={cn(
                            "px-4 py-2 text-xs font-bold transition-colors rounded-none",
                            activeTab === "commercial" ? "bg-[#0061AA] text-white" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Commercial Service
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {events.map((event) => (
                    <div key={event.id} className="relative pl-8 border-l-2 border-blue-500 flex items-center justify-between group">
                        <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1 tracking-tight">{event.time}</p>
                            <h3 className="text-[#172C41] font-bold text-lg">{event.date}</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-[#172C41] font-bold text-lg tracking-tight">{event.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleTimeline;
