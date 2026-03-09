"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
    id: string;
    category: string;
    date: string;
    readTime: string;
    title: string;
    excerpt: string;
    image: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
    id,
    category,
    date,
    readTime,
    title,
    excerpt,
    image,
}) => {
    return (
        <div className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Image with Category Badge */}
            <div className="relative aspect-video w-full overflow-hidden">
                <Image src={image} alt={title} fill className="object-cover" />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[#0061AA] uppercase tracking-wider">
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {date}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {readTime}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-[#0A2540] line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {excerpt}
                </p>

                <Link
                    href={`/blog/${id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0061AA] hover:text-[#004e89] transition-colors"
                >
                    Read more
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;
