"use client";

import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { CheckCircle2 } from "lucide-react";

const AboutMission = () => {
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Top Badge and Header */}
                <SectionHeader
                    badge="Our Mission"
                    title="Solutions That Keep Your Projects Moving Forward"
                    subtitle="We are committed to providing a seamless experience from the moment you request a dumpster to final pickup and disposal."
                />

                {/* Two Column Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="lg:col-span-6 space-y-4">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                            Dedicated to Streamlined Waste Disposal
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                            Our mission is to deliver reliable, efficient, and customer-focused waste management solutions that simplify cleanup and disposal for homeowners, contractors, and businesses alike. We believe that effective waste management is more than just delivering a container—it is about protecting properties, keeping jobsites organized, and honoring schedules.
                        </p>
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                                <CheckCircle2 className="size-4 text-[#005FA3] shrink-0" />
                                <span>Punctual morning and afternoon delivery windows</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                                <CheckCircle2 className="size-4 text-[#005FA3] shrink-0" />
                                <span>Driveway protection boards placed on every residential drop</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                                <CheckCircle2 className="size-4 text-[#005FA3] shrink-0" />
                                <span>Transparent pricing with no unexpected disposal surcharges</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative h-[300px] md:h-[380px] border border-slate-300 rounded-[2px] overflow-hidden shadow-2xs">
                        <Image
                            src="/about/mission_main.png"
                            alt="Bin Route  Mission"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMission;
