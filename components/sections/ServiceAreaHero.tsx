"use client";

import React, { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const locations = [
    { id: 1, address: "Worcester, MA 01602" },
    { id: 2, address: "Shrewsbury, MA 01545" },
    { id: 3, address: "Auburn, MA 01501" },
    { id: 4, address: "Millbury, MA 01527" },
    { id: 5, address: "Holden, MA 01520" },
];

const ServiceAreaHero = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredLocations = locations.filter((loc) =>
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="relative py-16 md:py-20 w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-[#EEF6FF] via-[#F8FAFC] to-white text-slate-900 border-b border-slate-200">
            {/* Background Decorative Ambient Gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-linear-to-r from-blue-200/40 via-sky-200/30 to-blue-200/40 blur-3xl rounded-full" />
            </div>

            <div className="container relative z-20 text-slate-900 max-w-4xl px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-md mb-2">
                        Central MA Service Coverage
                    </span>
                </motion.div>

                <motion.h1 
                    className="text-2xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-slate-900"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                    Select Your Delivery Area
                </motion.h1>

                {/* Search Bar Container */}
                <motion.div 
                    className="max-w-2xl mx-auto relative text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-md shadow-slate-200/60 border border-slate-300 relative z-30 p-1.5">
                        <div className="flex items-center flex-1 px-3.5 py-2 sm:py-0">
                            <MapPin className="text-[#0060AF] size-5 mr-2.5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Enter town or 5-digit zip code..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(e.target.value.length > 0);
                                }}
                                className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm"
                            />
                        </div>
                        <Button variant="primary" size="lg" className="px-6 text-xs sm:text-sm font-bold rounded-lg shadow-sm">
                            Search
                        </Button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {isDropdownOpen && filteredLocations.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-xl z-20 overflow-hidden border border-slate-200 rounded-xl mt-1.5">
                            {filteredLocations.map((loc) => (
                                <div
                                    key={loc.id}
                                    className="flex items-center justify-between p-3.5 border-b last:border-none border-slate-100 hover:bg-blue-50/70 cursor-pointer transition-colors group"
                                    onClick={() => {
                                        setSearchQuery(loc.address);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <MapPin className="size-4 text-slate-400 group-hover:text-[#0060AF] transition-colors" />
                                        <span className="text-slate-800 text-xs sm:text-sm font-semibold">
                                            {loc.address}
                                        </span>
                                    </div>
                                    <ArrowRight className="size-3.5 text-slate-400 group-hover:text-[#0060AF]" />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default ServiceAreaHero;

