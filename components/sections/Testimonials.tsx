"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";

const GoogleG = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

interface Testimonial {
  name: string;
  initials: string;
  bgColor: string;
  time: string;
  rating: number;
  text: string;
}

const TestimonialCard = ({
  name,
  initials,
  bgColor,
  time,
  rating,
  text,
}: Testimonial) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col w-[280px] md:w-[320px] shrink-0 self-stretch shadow-xs">
    {/* Avatar + meta */}
    <div className="flex items-start gap-3 mb-3">
      <div className="relative shrink-0">
        <div
          className={`size-8.5 rounded-lg flex items-center justify-center text-white font-bold text-xs ${bgColor}`}
        >
          {initials}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-md p-0.5 shadow-2xs border border-slate-100">
          <GoogleG size={10} />
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
            {name}
          </span>
          <CheckCircle2 className="size-3 text-blue-600 fill-blue-600 shrink-0" />
        </div>
        <span className="text-slate-400 text-[11px]">{time}</span>
      </div>
    </div>

    {/* Stars */}
    <div className="flex gap-0.5 mb-2.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>

    {/* Review text */}
    <p className="text-slate-600 text-xs leading-relaxed grow">
      {text.length > 140 ? <>{text.slice(0, 140)}...</> : text}
    </p>

    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
      <span>Verified Google Review</span>
      <span className="text-[#0060AF] font-bold">Worcester County, MA</span>
    </div>
  </div>
);

const testimonials: Testimonial[] = [
  {
    name: "Chris Casello",
    initials: "CC",
    bgColor: "bg-[#005FA3]",
    time: "1 month ago",
    rating: 5,
    text: "Timely, professional, and extremely affordable. The driver was super careful placing the dumpster on our driveway with boards. Highly recommend!",
  },
  {
    name: "Samuel Isham",
    initials: "SI",
    bgColor: "bg-emerald-700",
    time: "2 months ago",
    rating: 5,
    text: "Labonte Disposal was great during our renovation project. They were easy to schedule, communicative and efficient.",
  },
  {
    name: "Savannah Dols",
    initials: "SD",
    bgColor: "bg-slate-800",
    time: "2 months ago",
    rating: 5,
    text: "Rented a 20 yd dumpster from Labonte Disposal and I have nothing but great things to say. Clear pricing and fast haul away.",
  },
  {
    name: "Chris Casello",
    initials: "CC",
    bgColor: "bg-slate-700",
    time: "2 months ago",
    rating: 5,
    text: "Agradecemos pelo excelente serviço no aluguel da caçamba. Tudo ocorreu conforme o combinado e com pontualidade.",
  },
  {
    name: "Maria Johnson",
    initials: "MJ",
    bgColor: "bg-[#00487C]",
    time: "3 months ago",
    rating: 5,
    text: "Excellent service! The dumpster was delivered and picked up on time. Highly recommend for any home project in Worcester.",
  },
  {
    name: "James Walker",
    initials: "JW",
    bgColor: "bg-slate-900",
    time: "3 months ago",
    rating: 5,
    text: "Best dumpster rental experience I've had. Fair pricing, no hidden drop fees, and the team was very professional throughout.",
  },
];

const CARD_PX = 320;
const GAP_PX = 16;
const STEP = CARD_PX + GAP_PX;
const LEN = testimonials.length;

const cloned = [...testimonials, ...testimonials, ...testimonials];
const START = LEN;

const Testimonials = () => {
  const [idx, setIdx] = useState(START);
  const [anim, setAnim] = useState(true);
  const busy = useRef(false);
  const paused = useRef(false);

  useEffect(() => {
    if (!anim) {
      const id = requestAnimationFrame(() => setAnim(true));
      return () => cancelAnimationFrame(id);
    }
  }, [anim]);

  const go = (dir: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    setAnim(true);
    setIdx((p) => p + dir);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) go(1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const onEnd = () => {
    busy.current = false;
    setIdx((p) => {
      if (p >= LEN * 2) {
        setAnim(false);
        return LEN;
      }
      if (p < LEN) {
        setAnim(false);
        return LEN * 2 - 1;
      }
      return p;
    });
  };

  return (
    <section className="py-20 md:py-24 bg-[#F8FAFC] text-slate-900 border-y border-slate-200 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Heading */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-md mb-2">
            Verified Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
            Trusted Across Worcester County
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Real reviews from local homeowners, general contractors, and commercial builders.
          </p>
        </motion.div>

        {/* Google Reviews Summary */}
        <motion.div 
          className="bg-white border border-slate-200 shadow-xs rounded-xl max-w-xs mx-auto px-4 py-2.5 mb-10 flex items-center justify-between"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <GoogleG size={18} />
            <div>
              <span className="font-bold text-slate-900 text-xs mr-1">Google</span>
              <span className="text-slate-500 text-[11px]">Rating</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">5.0</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="size-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-slate-500 text-[11px] font-medium">(151+)</span>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          {/* Left Arrow */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-4 z-20 size-10 rounded-xl bg-white border border-slate-200 shadow-md hidden md:flex items-center justify-center text-slate-700 hover:text-[#0060AF] hover:border-[#0060AF] transition-all cursor-pointer"
          >
            <ChevronLeft className="size-4.5" />
          </button>

          {/* Mask */}
          <div
            className="overflow-hidden py-1"
            onMouseEnter={() => {
              paused.current = true;
            }}
            onMouseLeave={() => {
              paused.current = false;
            }}
          >
            <div
              className="flex items-stretch gap-4 pb-2"
              style={{
                transform: `translateX(-${idx * STEP}px)`,
                transition: anim
                  ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
                  : "none",
                willChange: "transform",
              }}
              onTransitionEnd={onEnd}
            >
              {cloned.map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => go(1)}
            aria-label="Next review"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-4 z-20 size-10 rounded-xl bg-white border border-slate-200 shadow-md hidden md:flex items-center justify-center text-slate-700 hover:text-[#0060AF] hover:border-[#0060AF] transition-all cursor-pointer"
          >
            <ChevronRight className="size-4.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
