"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ArticleCardProps {
  image: string;
  date: string;
  title: string;
  description?: string;
  featured?: boolean;
}

const ArticleCard = ({
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
            href="#"
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
    <div className="flex gap-4 group">
      <div className="relative size-24 md:size-32 shrink-0 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col py-1">
        <span className="text-gray-400 text-xs mb-2 font-medium">{date}</span>
        <h3 className="text-base md:text-lg font-bold text-[#0c243c] leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
};

const LatestArticles = () => {
  const featuredArticles = [
    {
      image: "/dummy.png",
      date: "March 25, 2026",
      title: "Smart Waste Planning for Home Projects",
      description:
        "Managing business waste doesn't have to be complicated. With the right planning and tools, you can stay compliant while reducing costs.",
      featured: true,
    },
    {
      image: "/dummy.png",
      date: "March 25, 2026",
      title: "Commercial Waste Solutions Made Simple",
      description:
        "Managing business waste doesn't have to be complicated. With the right planning and tools, you can stay compliant while reducing costs.",
      featured: true,
    },
  ];

  const sidebarArticles = [
    {
      image: "/dummy.png",
      date: "March 25, 2026",
      title: "When to Schedule a Dumpster Pickup",
    },
    {
      image: "/dummy.png",
      date: "March 25, 2026",
      title: "Keeping Your Driveway Safe During Rentals",
    },
    {
      image: "/dummy.png",
      date: "March 25, 2026",
      title: "Why Reliable Waste Service Matters",
    },
  ];

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
            {featuredArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>

          {/* Sidebar Articles */}
          <div className="lg:col-span-4 flex flex-col gap-8 md:gap-10">
            {sidebarArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
