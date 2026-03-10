"use client";

import React from "react";
import { MapPin, ArrowRight } from "lucide-react";

const locations = [
    { id: 1, address: "6391 Elgin St. Celina, Delaware 10299" },
    { id: 2, address: "2715 Ash Dr. San Jose, South Dakota 83475" },
    { id: 3, address: "2464 Royal Ln. Mesa, New Jersey 45463" },
    { id: 4, address: "4517 Washington Ave. Manchester, Kentucky 39495" },
    { id: 5, address: "6391 Elgin St. Celina, Delaware 10299" },
    { id: 6, address: "8502 Preston Rd. Inglewood, Maine 98380" },
    { id: 7, address: "2118 Thornridge Cir. Syracuse, Connecticut 35624" },
    { id: 8, address: "2118 Thornridge Cir. Syracuse, Connecticut 35624" },
    { id: 9, address: "2118 Thornridge Cir. Syracuse, Connecticut 35624" },
    { id: 10, address: "1901 Thornridge Cir. Shiloh, Hawaii 81063" },
];

const ServiceAreaList = () => {
    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container px-4">
                <h2 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-wide">
                    All SERVICE AREA
                </h2>

                <div className="flex flex-col gap-4">
                    {locations.map((loc) => (
                        <div
                            key={loc.id}
                            className="flex items-center justify-between bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-gray-50 flex items-center justify-center">
                                    <MapPin className="size-5 text-gray-700" />
                                </div>
                                <span className="text-gray-700 font-medium text-lg">
                                    {loc.address}
                                </span>
                            </div>
                            <ArrowRight className="size-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceAreaList;
