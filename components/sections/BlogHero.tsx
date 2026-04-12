"use client";

import React from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import Link from "next/link";

const BlogHero = () => {
    const { data: blogsResponse, isLoading } = useGetAllBlogsQuery({ 
        limit: 1, 
        sortBy: "createdAt", 
        sortOrder: "desc" 
    });

    const latestBlog = blogsResponse?.data?.data?.[0];

    if (isLoading) {
        return (
            <section className="relative h-[450px] md:h-[600px] w-full overflow-hidden flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0061AA]"></div>
            </section>
        );
    }

    if (!latestBlog) {
        return null;
    }

    return (
        <section className="relative h-[450px] md:h-[600px] w-full overflow-hidden flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={latestBlog.coverPhoto || latestBlog.thumbnail || "/blog/hero_bg.png"}
                    alt={latestBlog.title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/60 z-10" />
            </div>

            {/* Content */}
            <div className="container relative z-20 text-white px-4">
                <div className="max-w-4xl">
                    <span className="inline-block px-3 py-1 bg-[#0061AA] text-white text-xs font-bold uppercase tracking-wider mb-6">
                        {latestBlog.category}
                    </span>
                    <h1 className="text-3xl md:text-6xl font-bold mb-6 tracking-tight leading-tight line-clamp-2">
                        {latestBlog.title}
                    </h1>
                    <p className="text-lg md:text-xl font-medium mb-10 max-w-2xl opacity-90 leading-relaxed line-clamp-2">
                        {latestBlog.shortDescription}
                    </p>
                    <Link href={`/blog/${latestBlog.id}`}>
                        <Button
                            variant="outline"
                            className="bg-white hover:bg-white/90 text-[#0A2540] border-none flex items-center gap-3 px-6 py-6 font-semibold"
                        >
                            Read Time: {latestBlog.readingTime} minutes
                            <MoveRight className="size-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;
