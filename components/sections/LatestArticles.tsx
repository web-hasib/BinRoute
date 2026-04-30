"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleCardProps {
  id: string;
  image: string;
  date: string;
  title: string;
  description?: string;
  featured?: boolean;
}

const ArticleCard = ({
  id,
  image,
  date,
  title,
  description,
  featured,
}: ArticleCardProps) => {
  if (featured) {
    return (
      <div className="flex flex-col group">
        <div className="relative aspect-4/3 overflow-hidden mb-5">
          <Image
            src={image}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm mb-3 font-medium">{date}</span>
          <h3 className="text-2xl font-bold text-[#0c243c] mb-4 leading-tight group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-[#5a6b7d] text-sm leading-relaxed mb-6">
              {description}
            </p>
          )}
          <Link
            href={`/blog/${id}`}
            className="text-blue-600 font-bold text-sm flex items-center gap-2 group/link"
          >
            Read more{" "}
            <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/blog/${id}`} className="flex gap-4 group">
      <div className="relative size-24 md:size-32 shrink-0 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col py-1">
        <span className="text-gray-400 text-xs mb-2 font-medium">{date}</span>
        <h3 className="text-base md:text-lg font-bold text-[#0c243c] leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
      </div>
    </Link>
  );
};

const LatestArticles = () => {
  const { data: blogsResponse, isLoading } = useGetAllBlogsQuery({ 
    page: 1, 
    limit: 5, 
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const blogs = blogsResponse?.data?.data || [];

  const featuredArticles = blogs.slice(0, 2).map((blog: any) => ({
    id: blog.id,
    image: blog.coverPhoto,
    date: format(new Date(blog.createdAt), "MMMM dd, yyyy"),
    title: blog.title,
    description: blog.shortDescription,
    featured: true,
  }));

  const sidebarArticles = blogs.slice(2, 5).map((blog: any) => ({
    id: blog.id,
    image: blog.thumbnail || blog.coverPhoto,
    date: format(new Date(blog.createdAt), "MMMM dd, yyyy"),
    title: blog.title,
    featured: false,
  }));

  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 border border-gray-200 text-[#4a607d] text-[0.7rem] font-bold uppercase tracking-widest mb-6">
            Our Latest Artical
          </div>
          <h2 className="text-4xl md:text-[3rem] font-bold text-[#0c243c] tracking-tight leading-tight max-w-3xl mx-auto">
            Professional Insights for Better Project Planning
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Articles */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-4/3 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : (
              featuredArticles.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))
            )}
          </div>

          {/* Sidebar Articles */}
          <div className="lg:col-span-4 flex flex-col gap-8 md:gap-10">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="size-24 md:size-32 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
            ) : (
              sidebarArticles.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
