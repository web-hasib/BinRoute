"use client";

import React, { use } from "react";
import BlogContent from "@/components/sections/BlogContent";
import RelatedArticles from "@/components/sections/RelatedArticles";
import { useGetSingleBlogQuery } from "@/redux/api/blog/blogApi";

export default function BlogDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { data: blogResponse, isLoading } = useGetSingleBlogQuery(id);
    const blog = blogResponse?.data;

    return (
        <main className="pt-20 pb-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Main Content (8 columns on desktop) */}
                    <div className="lg:col-span-8">
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0061AA]"></div>
                            </div>
                        ) : blog ? (
                            <BlogContent blog={blog} />
                        ) : (
                            <div className="py-20 text-center text-gray-500 font-medium h-[50vh] flex items-center justify-center">
                                Blog not found.
                            </div>
                        )}
                    </div>

                    {/* Sidebar (4 columns on desktop) */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <RelatedArticles category={blog?.category} currentBlogId={id} />
                    </div>
                </div>
            </div>
        </main>
    );
}