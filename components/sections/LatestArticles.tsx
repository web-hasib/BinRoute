"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
      <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-150 flex flex-col group shadow-xs">
        <div className="relative aspect-16/10 overflow-hidden rounded-lg mb-4 border border-slate-200">
          <Image
            src={image || "/blog/hero_bg.png"}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />
        </div>
        <div className="flex flex-col grow">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-2">
            <Calendar className="size-3 text-[#0060AF]" />
            <span>{date}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-[#0060AF] transition-colors line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2 grow">
              {description}
            </p>
          )}
          <Link
            href={`/blog/${id}`}
            className="text-[#0060AF] font-bold text-xs inline-flex items-center gap-1 mt-auto group/link hover:underline"
          >
            <span>Read Full Guide</span>
            <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/blog/${id}`}
      className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-150 flex gap-3.5 group shadow-xs"
    >
      <div className="relative size-18 md:size-20 shrink-0 overflow-hidden rounded-lg border border-slate-200">
        <Image
          src={image || "/blog/hero_bg.png"}
          alt={title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center py-0.5 min-w-0">
        <span className="text-slate-500 text-[11px] font-medium mb-0.5">{date}</span>
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#0060AF] transition-colors line-clamp-2">
          {title}
        </h4>
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
    date: blog.createdAt ? format(new Date(blog.createdAt), "MMMM dd, yyyy") : "",
    title: blog.title,
    description: blog.shortDescription,
    featured: true,
  }));

  const sidebarArticles = blogs.slice(2, 5).map((blog: any) => ({
    id: blog.id,
    image: blog.thumbnail || blog.coverPhoto,
    date: blog.createdAt ? format(new Date(blog.createdAt), "MMMM dd, yyyy") : "",
    title: blog.title,
    featured: false,
  }));

  return (
    <section className="py-20 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            badge="Guides & Insights"
            title="Cleanout & Disposal Advice"
            subtitle="Expert advice on dumpster selection, permitting, construction waste disposal, and recycling in Massachusetts."
          />
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured Articles */}
          <motion.div 
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 space-y-3">
                  <Skeleton className="aspect-16/10 w-full rounded-lg" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              featuredArticles.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))
            )}
          </motion.div>

          {/* Sidebar Articles */}
          <motion.div 
            className="lg:col-span-4 flex flex-col gap-3 justify-between"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 flex gap-3">
                  <Skeleton className="size-18 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1.5 py-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
              ))
            ) : (
              sidebarArticles.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))
            )}

            {/* View All CTA Tile - Brand Blue Gradient */}
            <div className="p-6 bg-linear-to-br from-[#0060AF] via-[#0055A0] to-[#00488A] rounded-xl text-white border border-blue-600/30 shadow-md flex flex-col justify-between mt-1">
              <div>
                <h4 className="text-base font-bold text-white mb-1.5">Looking for more disposal tips?</h4>
                <p className="text-xs text-blue-50 leading-relaxed">
                  Browse our full library of waste management, sizing, and permit guides across Central Massachusetts.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/blog">
                  <Button variant="secondary" size="sm" className="w-full text-xs font-bold justify-center rounded-lg bg-white text-[#0060AF] hover:bg-blue-50 border-none shadow-sm">
                    <span>View All Articles</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
