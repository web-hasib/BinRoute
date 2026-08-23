"use client";

import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

const AboutPartner = () => {
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Top Badge and Header */}
                <SectionHeader
                    badge="Who We Are"
                    title="Your Direct Worcester Waste Management Partner"
                    subtitle="With a deep commitment to customer satisfaction, our team ensures every delivery, swap, and haul-away is completed with care."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-6 space-y-4">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug">
                            Locally Grounded, Customer Focused
                        </h3>
                        <div className="space-y-3 text-slate-600 leading-relaxed text-xs sm:text-sm">
                            <p>
                                At Bin Route , we are committed to delivering dependable and efficient waste management solutions for both residential and commercial customers. With a strong focus on reliability and clear communication, our team works diligently to ensure every service request is handled with professionalism and care.
                            </p>
                            <p>
                                We understand that effective waste removal plays a critical role in keeping home cleanouts organized and construction projects running smoothly. That is why we prioritize on-time delivery, transparent flat-rate pricing, and dedicated local support every step of the way.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Image Grid */}
                    <div className="lg:col-span-6 grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                            <div className="relative aspect-4/3 overflow-hidden rounded-[2px] border border-slate-300 shadow-2xs">
                                <Image
                                    src="/about/partner_grid_1.png"
                                    alt="Dumpster rental operation"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-square overflow-hidden rounded-[2px] border border-slate-300 shadow-2xs">
                                <Image
                                    src="/about/partner_grid_2.png"
                                    alt="Residential cleanup"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-3 pt-5">
                            <div className="relative aspect-3/4 overflow-hidden rounded-[2px] border border-slate-300 shadow-2xs">
                                <Image
                                    src="/about/partner_grid_3.png"
                                    alt="Commercial disposal equipment"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-4/3 overflow-hidden rounded-[2px] border border-slate-300 shadow-2xs">
                                <Image
                                    src="/about/partner_grid_4.png"
                                    alt="Driver and delivery truck"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPartner;
