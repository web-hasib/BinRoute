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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all duration-150 flex flex-col group shadow-xs">
            {/* Image with Category Tag */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                <Image
                    src={image || "/blog/hero_bg.png"}
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-102"
                />
                <span className="absolute top-2.5 right-2.5 bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-[#0060AF] rounded-md border border-slate-200 shadow-2xs">
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex flex-col grow justify-between space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="size-3 text-[#0060AF]" />
                            <span>{date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            <span>{readTime}</span>
                        </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0060AF] transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {excerpt}
                    </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                    <Link
                        href={`/blog/${id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0060AF] hover:underline"
                    >
                        <span>Read Full Guide</span>
                        <ArrowRight className="size-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
