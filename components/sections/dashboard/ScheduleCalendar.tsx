"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// MOCK EVENTS - In reality, these would come from an API based on the month/year
const mockEvents: Record<string, { type: "upcoming" | "pickup"; time: string }[]> = {
    "2026-05-01": [{ type: "upcoming", time: "8:00 AM - 10:00 AM" }],
    "2026-05-30": [{ type: "pickup", time: "8:00 AM - 10:00 AM" }],
};

const ScheduleCalendar = () => {
    // Defaulting to May 2026 as per design
    const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleString("default", { month: "long" });

    // Calculate days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Calculate first day of month (0-6)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const fillerDaysAtStart = Array.from({ length: firstDayOfMonth }, (_, i) => null);

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#172C41]">Schedule Days</h2>

                <div className="flex items-center gap-4">
                    {/* Navigation Buttons */}
                    <div className="flex items-center border border-gray-100 bg-gray-50">
                        <button onClick={prevMonth} className="px-3 py-2 hover:bg-gray-100 transition-colors border-r border-gray-100 cursor-pointer">
                            <ChevronLeft className="size-4 text-gray-500" />
                        </button>
                        <button onClick={nextMonth} className="px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                            <ChevronRight className="size-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border border-gray-100 transition-colors cursor-pointer hover:bg-gray-100">
                        <span className="text-[#172C41] font-bold text-sm">{monthName}, {year}</span>
                        <CalendarIcon className="size-4 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-t border-l border-gray-100">
                {daysOfWeek.map((day) => (
                    <div key={day} className="p-4 border-r border-b border-gray-100 text-gray-900 font-bold text-sm bg-gray-50/50">
                        {day}
                    </div>
                ))}

                {/* Previous Month Filler */}
                {fillerDaysAtStart.map((_, index) => {
                    const prevMonthLastDate = new Date(year, month, 0).getDate();
                    const fillerDay = prevMonthLastDate - (firstDayOfMonth - index - 1);
                    return (
                        <div key={`filler-${index}`} className="min-h-[140px] p-4 border-r border-b border-gray-50 text-gray-400 font-bold text-lg bg-gray-50/20">
                            {fillerDay}
                        </div>
                    );
                })}

                {/* Actual Days */}
                {days.map((day) => {
                    // Create a format YYYY-MM-DD for event matching
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const events = mockEvents[dateKey] || [];

                    return (
                        <div key={day} className="min-h-[140px] p-4 border-r border-b border-gray-50 text-[#172C41] font-bold text-lg relative group hover:bg-gray-50/30 transition-colors">
                            <span>{day}</span>

                            {events.map((event, eventIdx) => (
                                <div key={eventIdx} className="mt-2">
                                    <div className={cn(
                                        "text-[10px] font-bold px-2 py-1 flex items-center gap-1 w-fit mb-1",
                                        event.type === "upcoming" ? "bg-[#FFF1E7] text-[#FF8A3D]" : "bg-[#E7F3FF] text-[#006CF9]"
                                    )}>
                                        <div className={cn(
                                            "size-2 rounded-full animate-pulse",
                                            event.type === "upcoming" ? "bg-[#FF8A3D]" : "bg-[#006CF9]"
                                        )} />
                                        {event.type === "upcoming" ? "Upcoming.." : "Next pickup"}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">{event.time}</p>
                                </div>
                            ))}
                        </div>
                    );
                })}

                {/* Next Month Filler to complete 7cols x Nrows grid */}
                {Array.from({ length: 42 - (daysInMonth + firstDayOfMonth) }).map((_, index) => (
                    <div key={`next-filler-${index}`} className="min-h-[140px] p-4 border-r border-b border-gray-50 bg-gray-50/10">
                    </div>
                ))}

            </div>

            <p className="mt-6 text-gray-400 text-[10px] italic">
                * Note: Using native JS Date objects for grid calculation. Mock events are currently mapped to May 2026.
            </p>
        </div>
    );
};

export default ScheduleCalendar;
