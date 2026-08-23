"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutHero = () => {
    return (
        <section className="relative min-h-[380px] md:min-h-[420px] w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-[#EEF6FF] via-[#F8FAFC] to-white py-16 md:py-20 border-b border-slate-200">
            {/* Background Decorative Ambient Gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-linear-to-r from-blue-200/40 via-sky-200/30 to-blue-200/40 blur-3xl rounded-full" />
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-4 relative z-20 text-center text-slate-900">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-md mb-3">
                        Locally Owned & Operated • Worcester County
                    </span>
                </motion.div>

                <motion.h1 
                    className="text-3xl sm:text-5xl font-black mb-4 leading-tight text-slate-900 max-w-3xl mx-auto tracking-tight"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                    Dumpster Rentals Made Simple & Reliable
                </motion.h1>

                <motion.p 
                    className="text-xs sm:text-sm md:text-base font-normal max-w-2xl mx-auto text-slate-600 leading-relaxed"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                    We provide dependable roll-off dumpster solutions designed to support
                    residential cleanouts, renovation projects, construction sites, and
                    commercial operations across Central Massachusetts.
                </motion.p>
            </div>
        </section>
    );
};

export default AboutHero;
