"use client";

import React, { useState } from "react";
import BlogCard from "./BlogCard";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
    "All",
    "Project Tips",
    "Recycling",
    "Construction",
    "Commercial",
];

const blogPosts = [
    {
        id: "1",
        category: "Construction",
        date: "Oct 12, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
    {
        id: "2",
        category: "Project Tips",
        date: "Oct 10, 2023",
        readTime: "8 minutes",
        title: "Maximizing Your Dumpster Space",
        excerpt:
            "Effective waste management is more than just throwing things away. It's about strategy...",
        image: "/dummy.png",
    },
    {
        id: "3",
        category: "Recycling",
        date: "Oct 05, 2023",
        readTime: "6 minutes",
        title: "Sustainable Disposal: What Can Be Recycled?",
        excerpt:
            "Discover which materials from your renovation project can be diverted from landfills...",
        image: "/dummy.png",
    },
    {
        id: "4",
        category: "Commercial",
        date: "Sep 28, 2023",
        readTime: "7 minutes",
        title: "Managing Waste for Large Scale Operations",
        excerpt:
            "Commercial waste needs are unique. Here's how to streamline your operations...",
        image: "/dummy.png",
    },
    {
        id: "5",
        category: "Construction",
        date: "Sep 20, 2023",
        readTime: "5 minutes",
        title: "Residential Cleanout Guide",
        excerpt: "The ultimate checklist for your next home decluttering project...",
        image: "/dummy.png",
    },
    {
        id: "6",
        category: "Project Tips",
        date: "Sep 15, 2023",
        readTime: "4 minutes",
        title: "Choosing Between Dumpster Sizes",
        excerpt:
            "A quick guide to help you decide which yard size fits your project best...",
        image: "/dummy.png",
    },
    {
        id: "7",
        category: "Construction",
        date: "Sep 08, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
    {
        id: "8",
        category: "Construction",
        date: "Aug 30, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
    {
        id: "9",
        category: "Construction",
        date: "Aug 22, 2023",
        readTime: "5 minutes",
        title: "Construction Site Safety Protocols",
        excerpt:
            "Learn how new technologies are changing the way businesses handle waste and...",
        image: "/dummy.png",
    },
];

const BlogGrid = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#0A2540] mb-4">
                        Latest blogs
                    </h2>
                    <p className="text-gray-600 max-w-3xl">
                        Here, we share Dumpster rental services tips, destination guides,
                        and stories that inspire your next booking
                    </p>
                </div>

                {/* Filters and Sort */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 text-sm font-semibold transition-colors duration-300 ${activeCategory === cat
                                        ? "bg-[#0061AA] text-white"
                                        : "text-gray-600 hover:text-[#0061AA]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <span className="text-sm font-medium text-gray-500">Sort by :</span>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-sm font-semibold text-[#0A2540] border border-gray-100">
                            Newest
                            <ChevronDown className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {blogPosts.map((post) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2">
                    <button className="p-2 border border-gray-200 text-gray-400 hover:text-[#0061AA] hover:border-[#0061AA] transition-all">
                        <ChevronLeft className="size-5" />
                    </button>
                    {[1, 2, 3, 4].map((num) => (
                        <button
                            key={num}
                            className={`w-10 h-10 flex items-center justify-center font-bold transition-all ${num === 1
                                    ? "bg-[#0061AA] text-white"
                                    : "text-gray-600 hover:text-[#0061AA]"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                    <button className="p-2 border border-gray-200 text-gray-400 hover:text-[#0061AA] hover:border-[#0061AA] transition-all">
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogGrid;
