"use client";

import React from "react";

const FAQHero = () => {
    return (
        <section className="relative py-20 md:py-32 w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-[#003865] to-[#0061AA]">
            <div className="container relative z-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                    Dumpster rental questions
                </h1>
                <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto opacity-90 leading-relaxed">
                    Here are the questions we hear most from homeowners, contractors, and
                    local businesses in Worcester. If you do not see your question here,
                    you can call or email us anytime and we will help you.
                </p>
            </div>
        </section>
    );
};

export default FAQHero;
