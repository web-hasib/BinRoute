"use client";

import React from "react";

const events = [
    {
        id: 1,
        date: "Upcoming (1 May, 2026)",
        title: "Dumpster Drop-off",
        time: "10:00 AM - 50:00 PM" // Keeping the typo "50:00 PM" as per screenshot "10:00 AM - 50:00 PM"
    },
    {
        id: 2,
        date: "Upcoming (1 May, 2026)",
        title: "Dumpster Drop-off",
        time: "10:00 AM - 50:00 PM"
    },
    {
        id: 3,
        date: "Next (30 May, 2026)",
        title: "Dumpster Pick-up",
        time: "10:00 AM - 50:00 PM"
    }
];

const ActivityTimeline = () => {
    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm h-fit">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#172C41]">Activity Timeline</h2>
                <span className="text-gray-900 font-bold text-lg">4</span>
            </div>

            <div className="flex flex-col gap-6">
                {events.map((event) => (
                    <div key={event.id} className="relative pl-6 border-l-2 border-blue-500 flex items-center justify-between group">
                        <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1">{event.date}</p>
                            <h3 className="text-[#172C41] font-bold text-lg">{event.title}</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-[#172C41] font-bold text-sm tracking-tight">{event.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
