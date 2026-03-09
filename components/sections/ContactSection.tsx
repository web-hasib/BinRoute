"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Column: Form */}
                    <div className="bg-white p-8 md:p-12 shadow-sm">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-8">
                            Leave your message
                        </h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    className="w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Message"
                                    rows={6}
                                    className="w-full p-4 bg-gray-100 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-200 transition-colors resize-none"
                                ></textarea>
                            </div>

                            <Button className="w-full md:w-auto px-12 py-6 bg-[#0061AA] hover:bg-[#004e89] text-white font-semibold text-lg transition-colors">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Right Column: Info & Map */}
                    <div className="space-y-12 py-4">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540]">
                                Don't hesitate to contact us
                            </h2>
                            <p className="text-gray-600 md:text-lg">
                                If you need a dumpster for your home, job site, or business, we
                                are here to help. Call or email us today!
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-[#0A2540]">
                                    <Phone className="size-6 text-[#0061AA]" />
                                    <span className="text-lg font-semibold">774-622-1884</span>
                                </div>
                                <div className="flex items-center gap-4 text-[#0A2540]">
                                    <Mail className="size-6 text-[#0061AA]" />
                                    <span className="text-lg font-semibold">
                                        labontedisposal@gmail.com
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[#0A2540]">
                                    <MapPin className="size-6 text-[#0061AA]" />
                                    <span className="text-lg font-semibold">Worcester MA</span>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="relative aspect-video w-full overflow-hidden shadow-lg">
                            <Image
                                src="/contact/map.png"
                                alt="Worcester Map"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
