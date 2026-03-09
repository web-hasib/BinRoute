"use client";

import React from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogHero = () => {
    return (
        <section className="relative h-[450px] md:h-[600px] w-full overflow-hidden flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/blog/hero_bg.png"
                    alt="How to Choose the Right Dumpster Size"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/50 z-10" />
            </div>

            {/* Content */}
            <div className="container relative z-20 text-white px-4">
                <div className="max-w-4xl">
                    <h1 className="text-3xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        How to Choose the Right Dumpster Size for Your Home Renovation
                    </h1>
                    <p className="text-lg md:text-xl font-medium mb-10 max-w-2xl opacity-90 leading-relaxed">
                        Ensure your next home project runs smoothly with the perfect waste
                        management strategy. Don't overpay for space you don't need.
                    </p>
                    <Button
                        variant="outline"
                        className="bg-white hover:bg-white/90 text-[#0A2540] border-none flex items-center gap-3 px-6 py-6 font-semibold"
                    >
                        Read Time: 5 minutes
                        <MoveRight className="size-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;
