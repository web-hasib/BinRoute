"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  MapPin,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import ServiceCard from "./ServiceCard";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDispatch } from "react-redux";
import { setServiceType } from "@/feature/user/bookingSlice";
import { motion } from "framer-motion";

const ServiceOverview = () => {
  const dispatch = useDispatch();

  const handleBookNow = (type: "roll-off" | "commercial") => {
    dispatch(setServiceType(type));
  };

  const commercialServices = [
    {
      icon: ShoppingCart,
      title: "Scheduled Business Dumpsters",
      description:
        "Permanent 2 to 8-yard commercial dumpsters with recurring weekly or bi-weekly pickup schedules for restaurants, retail, and offices.",
    },
    {
      icon: Clock,
      title: "On-Demand Container Swaps",
      description:
        "Direct dispatch notifications for quick bin empties and swaps without disrupting ongoing commercial operations.",
    },
    {
      icon: MapPin,
      title: "Multi-Jobsite Logistics",
      description:
        "Centralized billing and coordinated roll-off container swaps across multiple active job sites in Central Massachusetts.",
    },
  ];

  const rollServices = [
    {
      icon: CalendarDays,
      title: "Same / Next-Day Delivery",
      description:
        "Prompt container drop-offs placed safely on your driveway with wood blocking protection boards included free.",
    },
    {
      icon: Clock,
      title: "Standard 7-Day Rental Included",
      description:
        "Keep your container for a full week to complete cleanouts, roofing, or remodeling at your own pace with easy extension options.",
    },
    {
      icon: ShieldCheck,
      title: "Flat-Rate Transparent Pricing",
      description:
        "Includes drop-off, pickup, specified tonnage weight allowance, and state-certified disposal with zero hidden fuel surcharges.",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            badge="Disposal Services"
            title="Roll-Off & Commercial Waste Solutions"
            subtitle="Direct local dispatch for residential homeowners, roofing contractors, and Central Massachusetts commercial businesses."
          />
        </motion.div>

        {/* Subsection 1: Commercial Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 pb-16 border-b border-slate-200">
          <motion.div 
            className="lg:col-span-6 order-2 lg:order-1 space-y-5"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <span className="block text-xs font-bold uppercase text-[#0060AF] mb-1.5">
                Commercial & Business Waste
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                Scheduled Commercial Dumpsters
              </h3>
            </div>
            <div className="space-y-2.5">
              {commercialServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
            <div className="pt-2">
              <Link href="/services/service-areas">
                <Button 
                  variant="primary"
                  onClick={() => handleBookNow("commercial")}
                  className="px-6 text-xs sm:text-sm font-bold rounded-md shadow-sm"
                >
                  <span>Book Commercial Service</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-6 relative h-[340px] md:h-[440px] order-1 lg:order-2 border border-slate-200 rounded-xl overflow-hidden shadow-xs"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src="/dummy.png"
              alt="Commercial Waste Management"
              fill
              className="object-cover transition-transform duration-500 hover:scale-102"
            />
          </motion.div>
        </div>

        {/* Subsection 2: Roll-Off Dumpster Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div 
            className="lg:col-span-6 relative h-[340px] md:h-[440px] border border-slate-200 rounded-xl overflow-hidden shadow-xs"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src="/home-1.png"
              alt="Residential Roll-Off Dumpsters"
              fill
              className="object-cover transition-transform duration-500 hover:scale-102"
            />
          </motion.div>

          <motion.div 
            className="lg:col-span-6 space-y-5"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <span className="block text-xs font-bold uppercase text-[#0060AF] mb-1.5">
                Residential & Construction
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                Roll-Off Dumpsters for Cleanouts
              </h3>
            </div>
            <div className="space-y-2.5">
              {rollServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
            <div className="pt-2">
              <Link href="/services/service-areas">
                <Button 
                  variant="primary"
                  onClick={() => handleBookNow("roll-off")}
                  className="px-6 text-xs sm:text-sm font-bold rounded-md shadow-sm"
                >
                  <span>Check Roll-Off Availability</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
