"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useGetJobSchedulesQuery } from "@/redux/api/jobs/jobsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/CustomPagination";

const formatJobType = (jobType: string) => {
    if (jobType === "DUMPSTER_PICK_UP") return "Dumpster Pick-up";
    if (jobType === "DROP_OFF") return "Dumpster Drop-off";
    return jobType;
};

const formatEventDate = (dateString: string, status: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    const finalStatus = statusText === "Pending" ? "Upcoming" : statusText;
    
    return `${finalStatus} (${formattedDate})`;
};

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

const TimelineSkeleton = () => (
    <div className="relative pl-8 border-l-2 border-gray-200 flex items-center justify-between group py-2">
        <div className="absolute left-[-9px] top-4 w-4 h-4 rounded-full bg-gray-200 border-4 border-white shadow-sm" />
        <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-6 w-48" />
        </div>
        <div className="text-right">
            <Skeleton className="h-5 w-24" />
        </div>
    </div>
);

interface ScheduleTimelineProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const ScheduleTimeline = ({ activeTab, setActiveTab }: ScheduleTimelineProps) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);
    
    const categoryParam = activeTab === "roll" ? "ROLL_OFF" : "COMMERCIAL";

    const { data: response, isLoading, isFetching } = useGetJobSchedulesQuery({
        category: categoryParam,
        page,
        limit,
        sortOrder: "desc",
        sortBy: "jobStartTime"
    });

    const jobs = response?.data?.data || [];
    const meta = response?.data?.meta;

    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm h-fit">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#172C41]">Activity Timeline</h2>

                {/* Service Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-none">
                    <button
                        onClick={() => {
                            setActiveTab("roll");
                            setPage(1);
                        }}
                        className={cn(
                            "px-4 py-2 text-xs font-bold transition-colors rounded-none",
                            activeTab === "roll" ? "bg-[#0061AA] text-white" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Roll of Service
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("commercial");
                            setPage(1);
                        }}
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
                {isLoading || isFetching ? (
                    <>
                        <TimelineSkeleton />
                        <TimelineSkeleton />
                        <TimelineSkeleton />
                    </>
                ) : jobs.length > 0 ? (
                    jobs.map((job: any) => (
                        <div key={job.jobId} className="relative pl-8 border-l-2 border-blue-500 flex items-center justify-between group">
                            <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1 tracking-tight">{formatTime(job.scheduledDate)}</p>
                                <h3 className="text-[#172C41] font-bold text-lg">{formatEventDate(job.scheduledDate, job.status)}</h3>
                            </div>
                            <div className="text-right">
                                <span className="text-[#172C41] font-bold text-lg tracking-tight">{formatJobType(job.jobType)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No schedules found.
                    </div>
                )}
            </div>

            {meta && meta.totalPage > 0 && (
                <div className="mt-8 border-t border-gray-100">
                    <CustomPagination
                        currentPage={page}
                        totalPages={meta.totalPage}
                        onPageChange={setPage}
                        rowsPerPage={limit}
                        onRowsPerPageChange={(rows) => {
                            setLimit(rows);
                            setPage(1);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ScheduleTimeline;
