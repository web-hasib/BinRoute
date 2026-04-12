"use client";

import React from "react";
import BlogCard from "./BlogCard";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import { format } from "date-fns";

interface RelatedArticlesProps {
    category?: string;
    currentBlogId?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ category, currentBlogId }) => {
    // Fetch related articles (same category or general latest if not provided)
    // We fetch a few more in case currentBlogId needs to be filtered out
    const { data: blogsResponse, isLoading } = useGetAllBlogsQuery({ 
        limit: 4, 
        searchTerm: category && category !== "All" ? category : undefined,
        sortBy: "createdAt",
        sortOrder: "desc"
    });

    const allBlogs = blogsResponse?.data?.data || [];
    
    // Filter out the current article and take top 3
    const relatedPosts = allBlogs
        .filter(post => post.id !== currentBlogId)
        .slice(0, 3);

    if (isLoading) {
        return (
            <aside className="space-y-8">
                <h2 className="text-2xl font-bold text-[#0A2540]">Related Articles</h2>
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0061AA]"></div>
                </div>
            </aside>
        );
    }

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <aside className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0A2540]">Related Articles</h2>
            <div className="flex flex-col gap-8">
                {relatedPosts.map((post) => (
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
        </aside>
    );
};

export default RelatedArticles;
