"use client";

import React from "react";

const ContactHero = () => {
    return (
        <section className="relative py-20 md:py-32 w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-[#003865] to-[#0061AA]">
            <div className="container relative z-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                    Feel free to Get in touch
                </h1>
                <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto opacity-90 leading-relaxed">
                    If you need a dumpster for your home, job site, or business, we are
                    here to help. Call or email us and we will set everything up for you.
                    Our team is based in Worcester and ready to answer your questions.
                </p>
            </div>
        </section>
    );
};

export default ContactHero;
