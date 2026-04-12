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
    
    // Add sorting state if needed, here keeping it simple
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

    // Build pagination array
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

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
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setPage(1); // Reset page on category change
                                }}
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
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0061AA]"></div>
                    </div>
                ) : (
                    <>
                        {blogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                                {blogs.map((post) => (
                                    <BlogCard 
                                        key={post.id} 
                                        id={post.id}
                                        category={post.category}
                                        date={post.createdAt ? format(new Date(post.createdAt), "MMM dd, yyyy") : ""}
                                        readTime={`${post.readingTime} minutes`}
                                        title={post.title}
                                        excerpt={post.shortDescription}
                                        image={post.thumbnail || post.coverPhoto || "/blog/hero_bg.png"}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500 text-lg">
                                No blogs found for this category.
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button 
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                    className="p-2 border border-gray-200 text-gray-400 hover:text-[#0061AA] hover:border-[#0061AA] transition-all disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-200"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                                {pages.map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`w-10 h-10 flex items-center justify-center font-bold transition-all ${num === page
                                                ? "bg-[#0061AA] text-white"
                                                : "text-gray-600 hover:text-[#0061AA]"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button 
                                    onClick={handleNext}
                                    disabled={page === totalPages}
                                    className="p-2 border border-gray-200 text-gray-400 hover:text-[#0061AA] hover:border-[#0061AA] transition-all disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-200"
                                >
                                    <ChevronRight className="size-5" />
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
