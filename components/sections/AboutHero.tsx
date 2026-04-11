"use client";

import React from "react";
import Image from "next/image";

const AboutHero = () => {
    return (
        <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero.png"
                    alt="Dumpster Rentals Made Simple"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Overlay for Text Readability - Matching the photo's feel */}
                <div className="absolute inset-0 bg-black/10 z-10" />
            </div>

            {/* Content */}
            <div className="container relative z-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                    Dumpster Rentals Made Simple
                </h1>
                <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto opacity-90 leading-relaxed">
                    We provide dependable roll-off dumpster solutions designed to support
                    residential cleanups, renovation projects, construction sites, and
                    commercial operations.
                </p>
            </div>
        </section>
    );
};

export default AboutHero;
