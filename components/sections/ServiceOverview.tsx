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
} from "lucide-react";
import ServiceCard from "./ServiceCard";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDispatch } from "react-redux";
import { setServiceType } from "@/feature/user/bookingSlice";

const ServiceOverview = () => {
  const dispatch = useDispatch();

  const handleBookNow = (type: "roll-off" | "commercial") => {
    dispatch(setServiceType(type));
  };
  const commercialServices = [
    {
      icon: ShoppingCart,
      title: "Flexible Ordering",
      description:
        "With our flexible ordering system, your business has full control over waste management. You can request extra pickups whenever needed, swap dumpster sizes or service types without any hassle",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description:
        "Our real-time update system keeps your business fully informed about every dumpster service. Track deliveries and pickups live, receive instant notifications about any delays or completed services",
    },
    {
      icon: MapPin,
      title: "Multi-Location Support",
      description:
        "Our multi-location support lets your business seamlessly handle dumpsters across multiple branches or sites. You can view the status of each container, track ongoing services",
    },
  ];

  const rollServices = [
    {
      icon: CalendarDays,
      title: "Easy Scheduling & Pickup",
      description:
        "We understand that home projects don't always follow a strict schedule. That's why our residential services allow you to easily book deliveries and request pickups online whenever you're ready.",
    },
    {
      icon: Clock,
      title: "One-Time Dumpster Rental",
      description:
        "Whether you're renovating your kitchen, cleaning out your garage, or handling a landscaping project, our one-time dumpster rental makes waste removal simple and stress-free.",
    },
    {
      icon: ShieldCheck,
      title: "Reliable & Transparent Service",
      description:
        "Our residential dumpster services are built around simplicity and trust. You'll receive clear pricing upfront with no hidden fees, along with reliable delivery and pickup times you can count on.",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container">
        {/* Main Header */}
        <SectionHeader
          badge="Our Service"
          title={
            <>
              Flexible Dumpster Services, <br /> Anytime You Need
            </>
          }
          className="mb-24"
        />

        {/* Subsection 1: Commercial Services (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <h3 className="text-[2rem] font-bold text-[#0c243c] mb-10">
              Commercial Services
            </h3>
            <div className="space-y-4 mb-10">
              {commercialServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
            <Link href="/services/booking">
              <Button 
                variant={"primary"}
                onClick={() => handleBookNow("commercial")}
              >
                Book Now
              </Button>
            </Link>
          </div>
          <div className="lg:col-span-6 relative h-[450px] md:h-[650px] order-1 lg:order-2">
            <Image
              src="/dummy.png"
              alt="Commercial Waste Management"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Subsection 2: Roll of Dumpster Services (Image Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-6 relative h-[450px] md:h-[650px]">
            <Image
              src="/dummy.png"
              alt="Residential Waste Management"
              fill
              className="object-cover shadow-none"
            />
          </div>
          <div className="lg:col-span-6">
            <h3 className="text-[2rem] font-bold text-[#0c243c] mb-10">
              Roll of Dumpster Services
            </h3>
            <div className="space-y-4 mb-10">
              {rollServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Link href="/services/booking">
                <Button 
                  variant={"primary"}
                  onClick={() => handleBookNow("roll-off")}
                >
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
