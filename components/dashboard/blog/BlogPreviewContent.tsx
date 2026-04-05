"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPreviewContentProps {
  data: {
    title: string;
    readingTime: string;
    category: string;
    excerpt: string;
    content: string;
    coverPhoto: string | null;
  };
}

const BlogPreviewContent: React.FC<BlogPreviewContentProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8">
      <div className="space-y-6 md:space-y-10 bg-white p-6 md:p-10 shadow-sm border border-gray-50">
        {/* Title */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0A2540] leading-tight">
            {data.title || "How to Choose the Right Dumpster Size for Your Home Renovation"}
          </h1>
        </div>

        {/* Cover Photo */}
        <div className="relative aspect-video w-full overflow-hidden shadow-sm bg-gray-100">
          <Image
            src={data.coverPhoto || "/dummy.png"}
            alt="Blog Cover"
            fill
            className="object-cover"
          />
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[#0061AA] uppercase tracking-wider">
            {data.category || "Construction"}
          </span>
        </div>

        {/* Metadata and Share */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-100 py-6">
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#0061AA]" />
              Oct 12, 2023
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-[#0061AA]" />
              {data.readingTime || "5"} minutes read
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

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <p className="text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-[#0061AA] pl-4 md:pl-6 text-[#0A2540] py-1 bg-[#F9FBFF]">
            {data.excerpt || "Efficient waste management is more than just throwing things away. It's about strategy, safety, and making the most of every cubic yard you pay for."}
          </p>

          <div 
            className="blog-content-rendered"
            dangerouslySetInnerHTML={{ 
              __html: data.content || "<p>When you rent a 20-yard dumpster, you're getting a versatile tool for residential and commercial projects alike. However, without proper planning, you might find yourself paying for air space or facing overweight fees. Here is how to maximize your rental like a pro.</p><h3>1. Create a Loading Strategy</h3><p>Don't just toss items in randomly. Start with large, flat items like plywood, drywall, old doors at the bottom. This creates a solid foundation and prevents 'pockets' of air that waste valuable volume.</p>" 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPreviewContent;
