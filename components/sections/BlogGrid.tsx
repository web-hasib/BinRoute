"use client";

import React, { useState } from "react";
import BlogCard from "./BlogCard";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import { format } from "date-fns";

const categories = [
    "All",
    "Project Tips",
    "Recycling",
    "Construction",
    "Commercial",
];

const BlogGrid = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(1);
    
    const limit = 6;
    const searchTerm = activeCategory === "All" ? "" : activeCategory;

    const { data: blogsResponse, isLoading } = useGetAllBlogsQuery({ 
        page, 
        limit, 
        searchTerm,
        sortBy: "createdAt",
        sortOrder: "desc"
    });

    const blogs = blogsResponse?.data?.data || [];
    const meta = blogsResponse?.data?.meta;
    const totalPages = meta?.totalPage || 1;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="mb-8">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#0060AF] mb-2">
                        Resource Center
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
                        Waste Management Resources & Guides
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
                        Explore practical disposal advice, dumpster sizing charts, permit tips, and recycling best practices for Worcester County projects.
                    </p>
                </div>

                {/* Filters and Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setPage(1);
                                }}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-[2px] border transition-all cursor-pointer ${
                                    activeCategory === cat
                                        ? "bg-[#0060AF] text-white border-[#0060AF] shadow-xs"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="size-7 rounded-full border-2 border-[#0060AF] border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {blogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                                {blogs.map((post: any) => (
                                    <BlogCard 
                                        key={post.id} 
                                        id={post.id}
                                        category={post.category || "Guide"}
                                        date={post.createdAt ? format(new Date(post.createdAt), "MMM dd, yyyy") : ""}
                                        readTime={`${post.readingTime || 5} min read`}
                                        title={post.title}
                                        excerpt={post.shortDescription}
                                        image={post.thumbnail || post.coverPhoto || "/blog/hero_bg.png"}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-14 text-slate-500 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-[2px]">
                                No articles found for this category.
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 mt-8">
                                <button 
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                    className="p-2 border border-slate-300 rounded-[2px] text-slate-500 hover:text-[#0060AF] hover:border-[#0060AF] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                {pages.map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`size-8 rounded-[2px] text-xs font-bold border transition-all cursor-pointer ${
                                            num === page
                                                ? "bg-[#0060AF] text-white border-[#0060AF] shadow-xs"
                                                : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:text-slate-900"
                                        }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button 
                                    onClick={handleNext}
                                    disabled={page === totalPages}
                                    className="p-2 border border-slate-300 rounded-[2px] text-slate-500 hover:text-[#0060AF] hover:border-[#0060AF] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default BlogGrid;
