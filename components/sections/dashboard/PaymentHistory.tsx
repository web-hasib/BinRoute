"use client";

import React, { useState } from "react";
import { Download, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// EXTENDED MOCK DATA for pagination testing
const allPayments = Array.from({ length: 42 }, (_, i) => ({
    id: `#INV-${88321 + i}`,
    serviceType: i % 3 === 0 ? "Roll of Service" : "Commercial Service",
    amount: `$${(245 + (i * 10)).toFixed(2)}`,
    date: `3:46 PM - ${String(i + 1).padStart(2, '0')} march 2026`,
    status: i % 5 === 0 ? "Pending" : "Paid"
}));

const ITEMS_PER_PAGE = 10;

const PaymentHistory = ({ title = "All Payment History" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState("All");

    // Filter data based on sortBy status
    const filteredPayments = allPayments.filter(payment => {
        if (sortBy === "All") return true;
        return payment.status.toLowerCase() === sortBy.toLowerCase();
    });

    const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

    // Slice data for current page
    const currentPayments = filteredPayments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    const handleDownload = (invoiceId: string) => {
        toast.info(`Starting download for ${invoiceId}...`, {
            description: "Your invoice PDF is being generated.",
            duration: 3000,
        });

        // Simulate a slight delay for realism
        setTimeout(() => {
            toast.success(`Success! ${invoiceId} has been downloaded.`);
        }, 1500);
    };

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
                            <th className="px-6 py-4 whitespace-nowrap text-center text-gray-400 font-bold text-xs uppercase tracking-wider">Invoice ID</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center text-gray-400 font-bold text-xs uppercase tracking-wider">Service Type</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center text-gray-400 font-bold text-xs uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center text-gray-400 font-bold text-xs uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center text-gray-400 font-bold text-xs uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 whitespace-nowrap text-gray-400 font-bold text-xs uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {currentPayments.map((payment, index) => (
                            <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-6 whitespace-nowrap text-[#172C41] font-bold text-sm">{payment.id}</td>
                                <td className="px-6 py-6 whitespace-nowrap text-gray-500 font-medium text-sm">{payment.serviceType}</td>
                                <td className="px-6 py-6 whitespace-nowrap text-[#172C41] font-bold text-sm">{payment.amount}</td>
                                <td className="px-6 py-6 whitespace-nowrap text-gray-500 font-medium text-sm">{payment.date}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <span className={cn(
                                        "inline-block px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-wider",
                                        payment.status === "Paid" ? "bg-green-50 text-green-500" : "bg-amber-50 text-amber-500"
                                    )}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => handleDownload(payment.id)}
                                        className="p-2 text-gray-400 hover:text-[#006CF9] transition-colors cursor-pointer"
                                    >
                                        <Download className="size-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center items-center gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronLeft className="size-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                            "w-10 h-10 border font-bold text-sm transition-colors cursor-pointer",
                            currentPage === page
                                ? "border-[#0061AA] bg-[#0061AA] text-white"
                                : "border-gray-100 hover:bg-gray-50 text-gray-500"
                        )}
                    >
                        {page}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-2 border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>

            <p className="mt-6 text-gray-400 text-[10px] italic">
                * Note: Data is currently mocked. Structured for easy integration with RTK Query / real APIs.
            </p>
        </div>
    );
};

export default PaymentHistory;
