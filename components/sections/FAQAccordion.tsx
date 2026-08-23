"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Phone } from "lucide-react";
import { useGetAllFaqsQuery } from "@/redux/api/faq/faqApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const FAQAccordion = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: faqsResponse, isLoading } = useGetAllFaqsQuery({ limit: 100 });
    const faqs = faqsResponse?.data?.data || [];

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return faqs;
        const q = searchQuery.toLowerCase();
        return faqs.filter(
            (f: any) =>
                f.title.toLowerCase().includes(q) ||
                f.description.toLowerCase().includes(q)
        );
    }, [faqs, searchQuery]);

    if (isLoading) {
        return (
            <section className="py-20 bg-[#F8FAFC] flex justify-center items-center">
                <div className="size-7 rounded-full border-2 border-[#0060AF] border-t-transparent animate-spin"></div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-20 bg-[#F8FAFC] overflow-hidden">
            <div className="container mx-auto max-w-3xl px-4">
                {/* Search Bar for FAQs */}
                <motion.div 
                    className="relative mb-6"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search frequently asked questions (e.g. prohibited items, sizes, permits)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0060AF] shadow-2xs transition-colors"
                    />
                </motion.div>

                {/* FAQ List */}
                <div className="space-y-2.5">
                    {filteredFaqs.map((item: any, index: number) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div
                                key={item.id}
                                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all duration-150"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                                    aria-expanded={isOpen}
                                    type="button"
                                >
                                    <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">
                                        {item.title}
                                    </span>
                                    <div
                                        className={`size-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-200 ${
                                            isOpen ? "rotate-180 bg-blue-50 text-[#0060AF]" : ""
                                        }`}
                                    >
                                        <ChevronDown className="size-4" />
                                    </div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="px-4 sm:px-5 pb-4 pt-1 border-t border-slate-100 text-slate-600 leading-relaxed text-xs sm:text-sm"
                                        >
                                            {item.description}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}

                    {filteredFaqs.length === 0 && (
                        <div className="text-center bg-white p-8 border border-slate-200 rounded-xl text-slate-500 text-xs sm:text-sm">
                            No answers found matching &quot;{searchQuery}&quot;. Try a different search term or call our dispatch desk.
                        </div>
                    )}
                </div>

                {/* Direct Contact Banner */}
                <motion.div 
                    className="mt-10 p-5 sm:p-6 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5">Need custom advice or commercial pricing?</h4>
                        <p className="text-[11px] text-slate-500">Call our Worcester dispatch desk directly for immediate answers.</p>
                    </div>
                    <a href="tel:7746221884">
                        <Button variant="primary" size="sm" className="gap-2 text-xs font-bold px-4 rounded-lg shadow-sm">
                            <Phone className="size-3.5" />
                            <span>(774) 622-1884</span>
                        </Button>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQAccordion;
