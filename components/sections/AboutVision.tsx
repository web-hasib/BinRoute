"use client";

import React from "react";
import Image from "next/image";

const AboutVision = () => {
    return (
        <section className=" bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Image with Overlay */}
                    <div className="relative h-[300px] md:h-[400px] overflow-hidden shadow-xl group">
                        <Image
                            src="/about/vision_overlay.png"
                            alt="Labonte Disposal Vision"
                            fill
                            className="object-cover"
                        />
                        {/* Text Overlay */}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-end p-8 md:p-12">
                            <div className="text-right max-w-[280px]">
                                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md">
                                    <span className="text-white/80 font-medium">EASY FOR</span>{" "}
                                    <span className="text-white">RESIDENTS,</span>
                                    <br />
                                    <span className="text-[#98D8FF] italic">efficient for you</span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#0A2540]">
                            Our Vision
                        </h3>
                        <div className="space-y-4 text-gray-600 leading-relaxed md:text-lg">
                            <p>
                                Our vision is to redefine waste management by setting a higher
                                standard of reliability, efficiency, and customer experience
                                within the industry. We aspire to become a trusted and
                                recognized leader by consistently delivering services that
                                exceed expectations and create measurable value for both
                                residential and commercial clients.
                            </p>
                            <p>
                                We envision a future where waste management is seamless,
                                transparent, and fully integrated into the planning process of
                                every project—whether small home renovations or large-scale
                                commercial operations. By investing in smarter systems,
                                streamlined operations, and modern digital tools, we strive to
                                make service management easier, faster, and more accessible
                                for our customers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutVision;
