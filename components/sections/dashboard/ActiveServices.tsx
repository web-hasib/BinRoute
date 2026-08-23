"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/auth/authApi";
import { useGetMySubscriptionsQuery } from "@/redux/api/subscription/subscriptionApi";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/CustomPagination";

const formatDate = (dateString?: string | null) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const ServiceSkeleton = () => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-gray-50 border border-gray-100 rounded-none gap-4">
        <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-16 rounded-none" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
            </div>
        </div>
        <Skeleton className="h-12 w-32 rounded-none" />
    </div>
);

// Reusable component
const ServiceItem = ({ service }: { service: any }) => {
    const isCommercial = service.plan?.category === "COMMERCIAL";
    const title = isCommercial ? "Commercial Dumpster Booking Service" : "Roll Off Dumpster Booking Service";
    const details = `${service.plan?.dumpsterSize || ""} Dumpster`;
    
    let duration = "";
    if (isCommercial) {
        duration = service.serviceFrequency ? service.serviceFrequency : "Varies";
    } else {
        const dropoff = formatDate(service.dropoffDate);
        const pickup = formatDate(service.pickupDate);
        duration = `${dropoff} - ${pickup}`;
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-gray-50 border border-gray-100 rounded-none gap-4">
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-16 bg-white rounded-none p-2 border border-gray-100">
                    <Image
                        src={service.plan?.image || "/dummy.png"}
                        alt={title}
                        fill
                        className="object-contain"
                    />
                </div>
                <div>
                    <h3 className="text-[#172C41] font-bold text-lg">{title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{details}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{duration}</p>
                </div>
            </div>
            {/* <Button className="bg-[#0061AA] hover:bg-[#003865] text-white font-semibold rounded-none px-8 py-6">
                View Schedule
            </Button> */}
        </div>
    );
};

const ActiveServices = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);

    const { data: userRes } = useGetMeQuery(undefined);
    const user = userRes?.data;

    const { data: subRes, isLoading, isFetching } = useGetMySubscriptionsQuery({ page, limit });
    const subscriptions = subRes?.data?.data || [];
    const meta = subRes?.data?.meta;

    const totalActive = meta?.total || 0;

    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm h-fit">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#172C41] mb-1">
                        Welcome back, {user?.fullName ? user.fullName : "..."} 👋
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Manage your roll-off dumpster services, track waste operations, and handle billing details.
                    </p>
                </div>
                <div className="sm:text-right">
                    <span className="text-[#172C41] font-bold text-lg">Active Service ({totalActive})</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {isLoading || isFetching ? (
                    <>
                        <ServiceSkeleton />
                        <ServiceSkeleton />
                        <ServiceSkeleton />
                    </>
                ) : subscriptions.length > 0 ? (
                    subscriptions.map((service: any) => (
                        <ServiceItem key={service.id} service={service} />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 bg-gray-50 border border-gray-100">
                        No active services found.
                    </div>
                )}
            </div>

            {meta && meta.totalPages > 0 && (
                <div className="mt-6 border-t border-gray-100">
                    <CustomPagination
                        currentPage={page}
                        totalPages={meta.totalPages}
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

export default ActiveServices;
