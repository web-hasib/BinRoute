"use client";

import React from "react";

const ReuseableHeroWithoutImage = ({title, description}: {title: string, description: string}) => {
    return (
        <section className="relative py-20 md:py-32 w-full overflow-hidden flex items-center justify-center bg-linear-to-r from-[#003865] to-[#0061AA]">
            <div className="container relative z-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto opacity-90 leading-relaxed">
                  {description}
                </p>
            </div>
        </section>
    );
};

export default ReuseableHeroWithoutImage;
