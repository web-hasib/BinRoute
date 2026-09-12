"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

// Google multicolor G SVG (small badge)
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
  <div className="bg-white p-5 flex flex-col w-[270px] md:w-[310px] shrink-0 self-stretch">
    {/* Avatar + meta */}
    <div className="flex items-start gap-3 mb-3">
      {/* Avatar with Google badge */}
      <div className="relative shrink-0">
        <div
          className={`size-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${bgColor}`}
        >
          {initials}
        </div>
        {/* Google G badge */}
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
          <GoogleG size={12} />
        </div>
      </div>

      {/* Name / time */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold text-[#0c243c] text-sm leading-tight truncate">
            {name}
          </span>
          <CheckCircle2 className="size-3.5 text-blue-500 fill-blue-500 shrink-0" />
        </div>
        <span className="text-gray-400 text-xs">{time}</span>
      </div>
    </div>

    {/* Stars */}
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>

    {/* Review text */}
    <p className="text-[#5a6b7d] text-sm leading-relaxed grow">
      {text.length > 130 ? <>{text.slice(0, 130)}...</> : text}
    </p>

    {/* Read more */}
    <button className="text-blue-600 font-semibold text-sm mt-3 text-left hover:underline w-fit">
      Read more
    </button>
  </div>
);

const testimonials: Testimonial[] = [
  {
    name: "Chris Casello",
    initials: "CC",
    bgColor: "bg-purple-600",
    time: "1 month ago",
    rating: 5,
    text: "Timely, professional, and extremely affordable. Highly recommend.",
  },
  {
    name: "Samuel Isham",
    initials: "SI",
    bgColor: "bg-teal-600",
    time: "2 months ago",
    rating: 5,
    text: "Bin Route was great during our renovation project. They were easy to schedule, communicative and efficient.",
  },
  {
    name: "Savannah Dols",
    initials: "SD",
    bgColor: "bg-violet-600",
    time: "2 months ago",
    rating: 5,
    text: "Rented a 20 yd dumpster from Bin Route and I have nothing but great things to say.",
  },
  {
    name: "Chris Casello",
    initials: "CC",
    bgColor: "bg-pink-600",
    time: "2 months ago",
    rating: 5,
    text: "Agradecemos pelo excelente serviço no aluguel da caçamba. Tudo ocorreu conforme o combinado.",
  },
  {
    name: "Maria Johnson",
    initials: "MJ",
    bgColor: "bg-orange-600",
    time: "3 months ago",
    rating: 5,
    text: "Excellent service! The dumpster was delivered and picked up on time. Highly recommend for any project.",
  },
  {
    name: "James Walker",
    initials: "JW",
    bgColor: "bg-blue-600",
    time: "3 months ago",
    rating: 5,
    text: "Best dumpster rental experience I've had. Fair pricing and the team was very professional throughout.",
  },
];

// Card width (px) + gap-4 (16px)
const CARD_PX = 310;
const GAP_PX = 16;
const STEP = CARD_PX + GAP_PX;
const LEN = testimonials.length;

// Triple-clone for seamless infinite loop
const cloned = [...testimonials, ...testimonials, ...testimonials];
const START = LEN; // start in the middle set

const Testimonials = () => {
  const [idx, setIdx] = useState(START);
  const [anim, setAnim] = useState(true);
  const busy = useRef(false);
  const paused = useRef(false);

  // Re-enable transition one frame after a silent jump
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

  // Autoplay: advance one card every 4 s, pause on hover
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) go(1);
    }, 4000);
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
    <section className="py-24 bg-[#002C4C]">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            Testimonial
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            What Our Customers Say
          </h2>
        </div>

        {/* Google Reviews block */}
        <div className="bg-white border border-gray-200 mx-auto px-6 py-5 mb-10">
          {/* Top row: Google logo + label */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <GoogleG size={20} />
            <span className="font-bold text-gray-800 text-base">Google</span>
            <span className="text-gray-500 text-sm">reviews</span>
          </div>
          <p className="text-gray-400 text-xs mb-3">1 month ago</p>

          {/* Rating row */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-lg">5.0</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-gray-400 text-xs">(151)</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow — sits outside the card track */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 size-9 bg-blue-600 rounded-full hidden md:flex items-center justify-center text-white shadow-lg hover:bg-blue-700 active:scale-90 transition-all duration-150"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Mask — pause autoplay on hover */}
          <div
            className="overflow-hidden"
            onMouseEnter={() => {
              paused.current = true;
            }}
            onMouseLeave={() => {
              paused.current = false;
            }}
          >
            {/* Track */}
            <div
              className="flex items-stretch gap-4 pb-2"
              style={{
                transform: `translateX(-${idx * STEP}px)`,
                transition: anim
                  ? "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)"
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

          {/* Right arrow */}
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 size-9 bg-blue-600 rounded-full hidden md:flex items-center justify-center text-white shadow-lg hover:bg-blue-700 active:scale-90 transition-all duration-150"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
