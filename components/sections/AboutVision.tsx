"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutVision = () => {
    return (
        <section className="py-20 md:py-24 bg-[#F8FAFC] border-y border-slate-200 overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Image with Overlay */}
                    <motion.div
                        className="lg:col-span-6 relative h-[320px] md:h-[400px] border border-slate-200 rounded-xl overflow-hidden shadow-xs group"
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Image
                            src="/about/vision_overlay.png"
                            alt="Bin Route  Vision"
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
                            <div>
                                <span className="text-[11px] font-bold text-sky-300 uppercase">Modern Disposal</span>
                                <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                                    Easy for residents, dependable for contractors.
                                </h4>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Text Content */}
                    <motion.div
                        className="lg:col-span-6 space-y-4"
                        initial={{ opacity: 0, x: 25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <span className="block text-xs font-bold uppercase text-[#0060AF] mb-1">
                            Our Long-Term Vision
                        </span>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                            Redefining Reliability Across Central Massachusetts
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                            Our vision is to set a new standard of reliability, transparent billing, and customer care in the roll-off dumpster industry. We aspire to be the first-choice waste disposal partner for homeowners undertaking renovations and contractors running demanding jobsites.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                            By leveraging streamlined dispatching, online booking convenience, and eco-responsible disposal recycling facilities, we ensure that waste removal is frictionless from start to finish.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutVision;
