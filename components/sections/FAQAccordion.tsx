"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGetAllFaqsQuery } from "@/redux/api/faq/faqApi";

const FAQAccordion = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { data: faqsResponse, isLoading } = useGetAllFaqsQuery({ limit: 100 });
    const faqs = faqsResponse?.data?.data || [];

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (isLoading) {
        return (
            <section className="py-16 md:py-24 bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0061AA]"></div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div
                            key={item.id}
                            className="bg-white shadow-sm overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                aria-expanded={openIndex === index}
                            >
                                <span className="text-lg md:text-xl font-bold text-[#0A2540]">
                                    {item.title}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="size-6 text-[#0061AA]" />
                                ) : (
                                    <ChevronDown className="size-6 text-[#0061AA]" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-gray-600 leading-relaxed md:text-lg">
                                        {item.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                    {faqs.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            No FAQs available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FAQAccordion;
