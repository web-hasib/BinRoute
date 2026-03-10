"use client";

import React, { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const locations = [
    { id: 1, address: "6391 Elgin St. Celina, Delaware 10299" },
    { id: 2, address: "2715 Ash Dr. San Jose, South Dakota 83475" },
    { id: 3, address: "2464 Royal Ln. Mesa, New Jersey 45463" },
    { id: 4, address: "4517 Washington Ave. Manchester, Kentucky 39495" },
    { id: 5, address: "6391 Elgin St. Celina, Delaware 10299" },
];

const ServiceAreaHero = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredLocations = locations.filter((loc) =>
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="relative py-16 md:py-24 w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-[#003865] to-[#0061AA]">
            <div className="container relative z-20 text-white px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
                    Please select your area below
                </h1>

                {/* Search Bar Container */}
                <div className="max-w-2xl relative">
                    <div className="flex flex-col sm:flex-row bg-white rounded-md overflow-hidden shadow-lg relative z-30">
                        <div className="flex items-center flex-1 px-5 py-4 sm:py-0">
                            <MapPin className="text-[#1f74ba] size-6 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Enter your address..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(e.target.value.length > 0);
                                }}
                                className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-500 font-medium text-lg"
                            />
                        </div>
                        <Button className="bg-[#279CF5] hover:bg-[#1f74ba] h-14 md:h-16 text-white font-bold rounded-none px-10 text-lg transition-colors border-none">
                            Search
                        </Button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {isDropdownOpen && filteredLocations.length > 0 && (
                        <div className="absolute top-full left-0 w-full md:w-[calc(100%-120px)] bg-white shadow-xl z-20 overflow-hidden">
                            {filteredLocations.map((loc) => (
                                <div
                                    key={loc.id}
                                    className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
                                    onClick={() => {
                                        setSearchQuery(loc.address);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <MapPin className="size-4 text-gray-500 group-hover:text-[#1f74ba] transition-colors" />
                                        <span className="text-gray-700 text-base">
                                            {loc.address}
                                        </span>
                                    </div>
                                    <ArrowRight className="size-4 text-gray-400 group-hover:text-gray-900" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ServiceAreaHero;

