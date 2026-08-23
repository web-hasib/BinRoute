"use client";

import React from "react";
import Image from "next/image";
import { MoveRight, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import Link from "next/link";
import { motion } from "framer-motion";

const BlogHero = () => {
    const { data: blogsResponse, isLoading } = useGetAllBlogsQuery({ 
        limit: 1, 
        sortBy: "createdAt", 
        sortOrder: "desc" 
    });

    const latestBlog = blogsResponse?.data?.data?.[0];

    if (isLoading) {
        return (
            <section className="relative min-h-[380px] md:min-h-[440px] w-full overflow-hidden flex items-center justify-center bg-[#F8FAFC]">
                <div className="size-8 rounded-full border-2 border-[#0060AF] border-t-transparent animate-spin"></div>
            </section>
        );
    }

    if (!latestBlog) {
        return null;
    }

    return (
        <section className="relative min-h-[380px] md:min-h-[460px] w-full overflow-hidden flex items-center bg-linear-to-b from-[#EEF6FF] via-[#F8FAFC] to-white py-16 border-b border-slate-200">
            {/* Background Decorative Ambient Gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-linear-to-r from-blue-200/40 via-sky-200/30 to-blue-200/40 blur-3xl rounded-full" />
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-6xl px-4 relative z-20 text-slate-900">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <motion.div 
                        className="lg:col-span-7 space-y-4"
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-md">
                            {latestBlog.category || "Featured Disposal Guide"}
                        </span>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight line-clamp-3 text-slate-900 tracking-tight">
                            {latestBlog.title}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base font-normal text-slate-600 leading-relaxed line-clamp-2 max-w-2xl">
                            {latestBlog.shortDescription}
                        </p>
                        <div className="pt-3">
                            <Link href={`/blog/${latestBlog.id}`}>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-6 text-xs sm:text-sm font-bold flex items-center gap-2 rounded-lg shadow-sm"
                                >
                                    <span>Read Full Guide ({latestBlog.readingTime || 5} min)</span>
                                    <MoveRight className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="lg:col-span-5 relative aspect-16/10 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Image
                            src={latestBlog.coverPhoto || latestBlog.thumbnail || "/blog/hero_bg.png"}
                            alt={latestBlog.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-102"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;
