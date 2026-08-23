"use client";

import React, { useState, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetJobSchedulesQuery } from "@/redux/api/jobs/jobsApi";
import Modal from "@/components/ui/Modal";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatTime = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        return "TBD";
    }
    
    return `${hours}:${minutesStr} ${ampm}`;
};

interface ScheduleCalendarProps {
    category: string;
}

const ScheduleCalendar = ({ category }: ScheduleCalendarProps) => {
    // Defaulting to June 2026 to match API data
    const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));
    const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: string, events: any[] } | null>(null);

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

    // Fetch up to 100 schedules for the calendar to ensure month coverage without pagination
    const { data: response } = useGetJobSchedulesQuery({ 
        category, 
        limit: 100,
        sortOrder: "desc",
        sortBy: "jobStartTime" 
    });
    
    const jobs = response?.data?.data || [];

    // Map jobs to the calendar dates
    const eventsMap = useMemo(() => {
        const map: Record<string, { 
            type: "upcoming" | "pickup"; 
            time: string;
            customerName: string;
            companyName: string;
            location: string;
            size: string;
            status: string;
            driverName: string | null;
        }[]> = {};
        
        jobs.forEach((job: any) => {
            if (!job.scheduledDate) return;
            const d = new Date(job.scheduledDate);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            
            if (!map[dateKey]) {
                map[dateKey] = [];
            }
            
            map[dateKey].push({
                type: job.jobType === "DUMPSTER_PICK_UP" ? "pickup" : "upcoming",
                time: formatTime(job.scheduledDate),
                customerName: job.customerName,
                companyName: job.companyName,
                location: job.location,
                size: job.size,
                status: job.status,
                driverName: job.driverName
            });
        });
        
        return map;
    }, [jobs]);

    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold text-[#172C41]">Schedule Days</h2>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Navigation Buttons */}
                    <div className="flex items-center border border-gray-100 bg-gray-50">
                        <button onClick={prevMonth} className="px-3 py-2 hover:bg-gray-100 transition-colors border-r border-gray-100 cursor-pointer">
                            <ChevronLeft className="size-4 text-gray-500" />
                        </button>
                        <button onClick={nextMonth} className="px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer">
                            <ChevronRight className="size-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border border-gray-100 transition-colors cursor-pointer hover:bg-gray-100 w-full sm:w-auto justify-center">
                        <span className="text-[#172C41] font-bold text-sm">{monthName}, {year}</span>
                        <CalendarIcon className="size-4 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid Wrapper for Mobile Scroll */}
            <div className="w-full overflow-x-auto pb-4">
                <div className="grid grid-cols-7 border-t border-l border-gray-100 min-w-[700px]">
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
                    const events = eventsMap[dateKey] || [];

                    return (
                        <div 
                            key={day} 
                            onClick={() => {
                                if (events.length > 0) {
                                    setSelectedDateEvents({ date: dateKey, events });
                                }
                            }}
                            className={cn(
                                "min-h-[140px] p-4 border-r border-b border-gray-50 text-[#172C41] font-bold text-lg relative group transition-colors",
                                events.length > 0 ? "cursor-pointer hover:bg-gray-50/50" : ""
                            )}
                        >
                            <span>{day}</span>

                            {events.length > 0 && (
                                <div className="mt-4">
                                    <div className="text-[10px] font-bold px-2 py-1.5 flex items-center justify-center gap-1 w-full rounded bg-[#E7F3FF] text-[#006CF9] shadow-sm">
                                        <div className="size-2 rounded-full animate-pulse bg-[#006CF9]" />
                                        {events.length} Schedule{events.length > 1 ? 's' : ''}
                                    </div>
                                    <p className="text-center text-[10px] text-gray-400 font-medium mt-1 group-hover:text-[#006CF9] transition-colors">Click to view</p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Next Month Filler to complete 7cols x Nrows grid */}
                {Array.from({ length: 42 - (daysInMonth + firstDayOfMonth) }).map((_, index) => (
                    <div key={`next-filler-${index}`} className="min-h-[120px] md:min-h-[140px] p-4 border-r border-b border-gray-50 bg-gray-50/10">
                    </div>
                ))}
            </div>
            </div>

            {/* Modal for Day Details */}
            <Modal
                isOpen={!!selectedDateEvents}
                onClose={() => setSelectedDateEvents(null)}
                title={`Schedules for ${selectedDateEvents ? new Date(selectedDateEvents.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}`}
                description={`You have ${selectedDateEvents?.events.length || 0} schedules on this day.`}
            >
                <div className="flex flex-col gap-4 mt-2">
                    {selectedDateEvents?.events.map((event, eventIdx) => (
                        <div key={eventIdx} className={cn(
                            "flex items-start justify-between p-4 rounded-lg border",
                            event.type === "upcoming" ? "bg-[#FFF1E7]/30 border-[#FF8A3D]/20" : "bg-[#E7F3FF]/50 border-[#006CF9]/20"
                        )}>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={cn(
                                        "text-xs font-bold px-2 py-1 rounded-md w-fit flex items-center gap-1.5",
                                        event.type === "upcoming" ? "bg-[#FFF1E7] text-[#FF8A3D]" : "bg-[#E7F3FF] text-[#006CF9]"
                                    )}>
                                        <div className={cn(
                                            "size-2 rounded-full animate-pulse",
                                            event.type === "upcoming" ? "bg-[#FF8A3D]" : "bg-[#006CF9]"
                                        )} />
                                        {event.type === "upcoming" ? "Upcoming Drop-off" : "Scheduled Pick-up"}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                        event.status === "COMPLETED" ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
                                    )}>
                                        {event.status}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-2 mt-3">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Time & Size</p>
                                        <p className="text-sm font-bold text-[#172C41]">{event.time} • {event.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Customer</p>
                                        <p className="text-sm font-medium text-gray-700">{event.customerName} {event.companyName ? `(${event.companyName})` : ''}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Location</p>
                                        <p className="text-sm font-medium text-gray-700 break-words">{event.location || "N/A"}</p>
                                    </div>
                                    {event.driverName && (
                                        <div className="sm:col-span-2">
                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Driver</p>
                                            <p className="text-sm font-medium text-gray-700">{event.driverName}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default ScheduleCalendar;
