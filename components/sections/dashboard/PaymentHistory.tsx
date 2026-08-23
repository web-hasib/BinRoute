"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetPaymentHistoryQuery } from "@/redux/api/payments/paymentsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/CustomPagination";

const formatServiceType = (type: string) => {
    if (type === "ROLL_OFF") return "Roll of Service";
    if (type === "COMMERCIAL") return "Commercial Service";
    return type;
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    const formattedDate = date.toLocaleDateString("en-GB", { month: "long", year: "numeric", day: "2-digit" }).toLowerCase();
    return `${hours}:${minutesStr} ${ampm} - ${formattedDate}`;
};

const TableSkeleton = () => (
    <>
        {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-b border-gray-50">
                <td className="px-6 py-6"><Skeleton className="h-4 w-32" /></td>
                <td className="px-6 py-6"><Skeleton className="h-4 w-20" /></td>
                <td className="px-6 py-6"><Skeleton className="h-4 w-40" /></td>
                <td className="px-6 py-6"><Skeleton className="h-6 w-24 rounded-none" /></td>
            </tr>
        ))}
    </>
);

const PaymentHistory = ({ title = "All Payment History" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState("All");

    const statusParam = sortBy === "All" ? undefined : sortBy === "Paid" ? "SUCCEEDED" : "PENDING";

    const { data: response, isLoading, isFetching } = useGetPaymentHistoryQuery({
        page: currentPage,
        limit,
        ...(statusParam ? { status: statusParam } : {})
    });

    const payments = response?.data || [];
    const meta = response?.meta;
    const totalPages = meta?.totalPage || 1;

    return (
        <div className="bg-white p-4 md:p-6 rounded-none shadow-sm h-fit">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#172C41]">{title}</h2>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-medium">Sort by :</span>
                        <div
                            className="relative"
                            onBlur={() => setTimeout(() => setSortOpen(false), 200)}
                        >
                            <button
                                onClick={() => setSortOpen(!sortOpen)}
                                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-[#172C41] font-bold text-[10px] uppercase">{sortBy}</span>
                                <ChevronDown className={cn("size-3 text-gray-500 transition-transform", sortOpen && "rotate-180")} />
                            </button>

                            {sortOpen && (
                                <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-100 shadow-lg z-50">
                                    {["All", "Paid", "Pending"].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSortBy(option);
                                                setCurrentPage(1); // Reset page on filter change
                                                setSortOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-[#172C41] hover:bg-gray-50 transition-colors uppercase"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-y border-gray-100">
                            <th className="px-6 py-4 whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Service Type</th>
                            <th className="px-6 py-4 whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading || isFetching ? (
                            <TableSkeleton />
                        ) : payments.length > 0 ? (
                            payments.map((payment: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-6 whitespace-nowrap text-gray-500 font-medium text-sm">{formatServiceType(payment.subscriptionType)}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-[#172C41] font-bold text-sm">${Number(payment.amount).toFixed(2)}</td>
                                    <td className="px-6 py-6 whitespace-nowrap text-gray-500 font-medium text-sm">{formatDate(payment.date)}</td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className={cn(
                                            "inline-block px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-wider",
                                            payment.status === "SUCCEEDED" ? "bg-green-50 text-green-500" : "bg-amber-50 text-amber-500"
                                        )}>
                                            {payment.status === "SUCCEEDED" ? "Paid" : payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                                    No payment history found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="mt-8 border-t border-gray-100">
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={limit}
                        onRowsPerPageChange={(rows) => {
                            setLimit(rows);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
