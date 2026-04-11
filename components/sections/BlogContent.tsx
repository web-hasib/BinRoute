"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { IBlog } from "@/redux/api/blog/blogApi";

interface BlogContentProps {
    blog?: IBlog;
}

const BlogContent: React.FC<BlogContentProps> = ({ blog }) => {
    if (!blog) {
        return (
            <div className="py-20 text-center text-gray-500 font-medium">
                Loading blog content...
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Article Header */}
            <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold text-[#0A2540] leading-tight">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-100 py-6">
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-[#0061AA]" />
                            {blog.createdAt ? format(new Date(blog.createdAt), "MMM dd, yyyy") : ""}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-[#0061AA]" />
                            {blog.readingTime} minutes read
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-[#0061AA] border-[#0061AA] hover:bg-[#0061AA] hover:text-white transition-all font-semibold rounded-none"
                    >
                        <Share2 className="size-4" />
                        Share Now
                    </Button>
                </div>
            </div>

            {/* Main Image */}
            <div className="relative aspect-video w-full overflow-hidden shadow-lg">
                <Image
                    src={blog.coverPhoto || blog.thumbnail || "/blog/hero_bg.png"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Article Body */}
            <div 
                className="prose prose-lg max-w-none text-gray-700 space-y-8"
                dangerouslySetInnerHTML={{ __html: blog.fullContent }}
            />
        </div>
    );
};

export default BlogContent;
