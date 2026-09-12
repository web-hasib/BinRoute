"use client";

import React from "react";
import Image from "next/image";

const AboutMission = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Top Badge and Header */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-[#0061AA] uppercase bg-[#E6F0F7] rounded-sm">
                        Our Mission
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#0A2540] max-w-3xl leading-tight">
                        Solutions That Keep Your Projects Moving
                    </h2>
                </div>

                {/* Two Column Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
                    <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#0A2540]">
                            Our Mission
                        </h3>
                        <div className="space-y-4 text-gray-600 leading-relaxed md:text-lg">
                            <p>
                                Our mission is to deliver reliable, efficient, and
                                customer-focused waste management solutions that simplify
                                cleanup and disposal for homeowners, contractors, and
                                businesses alike. We are committed to providing a seamless
                                experience from the moment a service is requested to the final
                                pickup and disposal.
                            </p>
                            <p>
                                We believe that effective waste management is more than just
                                delivering a container—it's about supporting our customers'
                                projects, protecting their properties, and helping them stay
                                organized and productive.
                            </p>
                        </div>
                    </div>

                    <div className="relative h-[350px] md:h-[450px] overflow-hidden shadow-xl">
                        <Image
                            src="/about/mission_main.png"
                            alt="Bin Route Mission"
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
