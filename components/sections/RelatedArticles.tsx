"use client";

import React from "react";
import BlogCard from "./BlogCard";

const RelatedArticles = () => {
    const relatedPosts = [
        {
            id: "7",
            category: "Construction",
            date: "Oct 12, 2023",
            readTime: "5 minutes",
            title: "Construction Site Safety Protocols",
            excerpt:
                "Learn how new technologies are changing the way businesses handle waste and...",
            image: "/dummy.png",
        },
        {
            id: "8",
            category: "Construction",
            date: "Oct 12, 2023",
            readTime: "5 minutes",
            title: "Construction Site Safety Protocols",
            excerpt:
                "Learn how new technologies are changing the way businesses handle waste and...",
            image: "/dummy.png",
        },
        {
            id: "9",
            category: "Construction",
            date: "Oct 12, 2023",
            readTime: "5 minutes",
            title: "Construction Site Safety Protocols",
            excerpt:
                "Learn how new technologies are changing the way businesses handle waste and...",
            image: "/dummy.png",
        },
    ];

    return (
        <aside className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0A2540]">Related Articles</h2>
            <div className="flex flex-col gap-8">
                {relatedPosts.map((post) => (
                    <BlogCard key={post.id} {...post} />
                ))}
            </div>
        </aside>
    );
};

export default RelatedArticles;
