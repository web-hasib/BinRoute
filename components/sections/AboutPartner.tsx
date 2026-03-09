"use client";

import React from "react";
import Image from "next/image";

const AboutPartner = () => {
    return (
        <section className="py-16 md:py-24 bg-[#F8FAFC]">
            <div className="container mx-auto px-4">
                {/* Top Badge and Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-[#0061AA] uppercase bg-[#E6F0F7] rounded-sm">
                        What we are
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#0A2540] max-w-3xl leading-tight">
                        Your Trusted Waste Management Partner
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column: Text Content */}
                    <div className="space-y-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#0A2540]">
                            About Labonte Disposal
                        </h3>
                        <div className="space-y-6 text-gray-600 leading-relaxed md:text-lg">
                            <p>
                                At Labonte Disposal, we are committed to delivering dependable
                                and efficient waste management solutions for both residential
                                and commercial customers. With a strong focus on reliability
                                and customer satisfaction, our team works diligently to ensure
                                every delivery, pickup, and service request is handled with
                                professionalism and care.
                            </p>
                            <p>
                                We understand that effective waste removal plays a critical role
                                in keeping projects organized and businesses running smoothly.
                                That's why we prioritize timely service, transparent pricing,
                                and clear communication at every step. From small home
                                cleanouts to large commercial operations, we provide solutions
                                designed to meet diverse needs while maintaining consistent
                                service standards.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Image Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] overflow-hidden shadow-md">
                                <Image
                                    src="/about/partner_grid_1.png"
                                    alt="Service scene 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-square overflow-hidden shadow-md">
                                <Image
                                    src="/about/partner_grid_2.png"
                                    alt="Service scene 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-4 pt-8">
                            <div className="relative aspect-[3/4] overflow-hidden shadow-md">
                                <Image
                                    src="/about/partner_grid_3.png"
                                    alt="Service scene 3"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative aspect-[4/3] overflow-hidden shadow-md">
                                <Image
                                    src="/about/partner_grid_4.png"
                                    alt="Service scene 4"
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
