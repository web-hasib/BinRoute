"use client";

import React, { useState } from "react";
import { useGetJobSchedulesQuery } from "@/redux/api/jobs/jobsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/CustomPagination";

const formatJobType = (jobType: string) => {
    if (jobType === "DUMPSTER_PICK_UP") return "Dumpster Pick-up";
    if (jobType === "DROP_OFF") return "Dumpster Drop-off";
    return jobType;
};

const formatEventDate = (dateString: string, status: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    
    // Capitalize first letter of status
    const statusText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    const finalStatus = statusText === "Pending" ? "Upcoming" : statusText;
    
    return `${finalStatus} (${formattedDate})`;
};

const formatTime = (dateString: string) => {
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
    <div className="relative pl-6 border-l-2 border-gray-200 flex items-center justify-between group py-2">
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

const ActivityTimeline = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const { data: response, isLoading, isFetching } = useGetJobSchedulesQuery({
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
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-[#172C41]">Activity Timeline</h2>
                    {meta?.total !== undefined && (
                        <span className="text-gray-900 font-bold text-lg">{meta.total}</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {isLoading || isFetching ? (
                    <>
                        <TimelineSkeleton />
                        <TimelineSkeleton />
                        <TimelineSkeleton />
                    </>
                ) : jobs.length > 0 ? (
                    jobs.map((job: any) => (
                        <div key={job.jobId} className="relative pl-6 border-l-2 border-blue-500 flex items-center justify-between group">
                            <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">
                                    {formatEventDate(job.scheduledDate, job.status)}
                                </p>
                                <h3 className="text-[#172C41] font-bold text-lg">
                                    {formatJobType(job.jobType)}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span className="text-[#172C41] font-bold text-sm tracking-tight">
                                    {formatTime(job.scheduledDate)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No activity found.
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

export default ActivityTimeline;
