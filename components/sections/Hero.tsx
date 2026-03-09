"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-[450px] sm:h-[550px] lg:h-[calc(100vh-100px)] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/dummy.png"
          alt="Dumpster Rentals"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/0 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent z-11" />
      </div>

      {/* Content */}
      <div className="container relative z-20 text-center text-[#FAFDFF]">
        <h1 className="text-2xl sm:text-3xl md:text-[4rem] font-bold mb-6 tracking-tight leading-[1.1]">
          Dumpster Rentals in <br />
          Greater Worcester MA
        </h1>
        <p className="text-xs sm:text-sm md:text-md font-medium mb-10 max-w-lg mx-auto opacity-90">
          Fast and easy waste removal for homes, contractors, and local
          businesses across Worcester County MA.
        </p>

        {/* Search Bar - Exactly like image */}
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row bg-white rounded-none overflow-hidden shadow-sm">
          <div className="flex items-center flex-1 px-4 py-4 md:py-0 border-b md:border-b-0">
            <MapPin className="text-[#1f74ba] size-5 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Enter your address..."
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-500 font-normal text-sm"
            />
          </div>
          <Button className="bg-linear-to-t from-[#0061AA] to-[#279CF5] h-12 hover:bg-[#279CF5] text-white font-semibold rounded-none px-6 py-7 md:py-0 text-md transition-colors">
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
