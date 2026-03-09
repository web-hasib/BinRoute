"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogContent = () => {
    return (
        <div className="space-y-10">
            {/* Article Header */}
            <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold text-[#0A2540] leading-tight">
                    How to Choose the Right Dumpster Size for Your Home Renovation
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-100 py-6">
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-[#0061AA]" />
                            Oct 12, 2023
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-[#0061AA]" />
                            5 minutes read
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-[#0061AA] border-[#0061AA] hover:bg-[#0061AA] hover:text-white transition-all font-semibold"
                    >
                        <Share2 className="size-4" />
                        Share Now
                    </Button>
                </div>
            </div>

            {/* Main Image */}
            <div className="relative aspect-video w-full overflow-hidden shadow-lg">
                <Image
                    src="/blog/hero_bg.png"
                    alt="Dumpster Size Guide"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                <p className="text-xl font-medium leading-relaxed italic border-l-4 border-[#0061AA] pl-6 text-[#0A2540]">
                    Efficient waste management is more than just throwing things away.
                    It's about strategy, safety, and making the most of every cubic yard
                    you pay for.
                </p>

                <p>
                    When you rent a 20-yard dumpster, you're getting a versatile tool for
                    residential and commercial projects alike. However, without proper
                    planning, you might find yourself paying for air space or facing
                    overweight fees. Here is how to maximize your rental like a pro.
                </p>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#0A2540]">
                        1. Create a Loading Strategy
                    </h2>
                    <p>
                        Don't just toss items in randomly. Start with large, flat items like
                        plywood, drywall, or old doors at the bottom. This creates a solid
                        foundation and prevents "pockets" of air that waste valuable volume.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="relative aspect-square overflow-hidden shadow-md"
                            >
                                <Image
                                    src="/dummy.png"
                                    alt={`Step ${i}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-sm italic text-gray-500 text-center">
                        In-line: Proper waste stacking ensures you use all 20 cubic yards
                        effectively.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#0A2540]">
                        2. Know Your Weight Limits
                    </h2>
                    <p>
                        While a 20-yarder is spacious, it has weight restrictions. Heavy
                        debris like concrete, brick, and dirt adds up fast. If your project
                        involves these materials, consider a dedicated 'heavy debris'
                        dumpster or check your rental agreement for specific tonnage limits.
                    </p>

                    <blockquote className="bg-[#f8fbff] p-8 border-l-4 border-[#0061AA] shadow-sm">
                        <p className="text-lg font-bold text-[#0A2540] italic mb-0">
                            "The biggest mistake most renovators make isn't the size of the
                            dumpster, but the lack of a stacking plan. Treat it like a giant
                            game of Tetris."
                        </p>
                    </blockquote>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#0A2540]">
                        3. Break Down Large Items
                    </h2>
                    <p>
                        Take five minutes to break down furniture or large boxes. You'll be
                        surprised how much extra space you gain by:
                    </p>
                    <ul className="space-y-3">
                        {[
                            "Disassembling wooden table legs.",
                            "Crushing cardboard boxes before disposal.",
                            "Cutting long lumber into 4-foot sections.",
                        ].map((tip, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Check className="size-5 text-green-600 mt-1 shrink-0" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#0A2540]">
                        4. Avoid Forbidden Items
                    </h2>
                    <p>
                        Hazardous materials like paint cans, tires, and appliances with
                        Freon can lead to hefty fines or the rejection of your entire load.
                        Always keep a separate pile for recyclables and toxic waste.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default BlogContent;
