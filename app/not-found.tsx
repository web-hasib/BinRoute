"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowRight, Phone } from "lucide-react";
import { DumpTruckIcon } from "@/components/icons/DumpTruckIcon";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm text-center">
        {/* Animated Icon */}
        <div className="size-16 mx-auto rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0060AF] mb-5">
          <DumpTruckIcon className="size-8 text-[#0060AF]" />
        </div>

        <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mb-2">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          The dumpster size, guide, or page you are looking for might have been moved or is currently unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-6 text-xs sm:text-sm font-bold gap-2 rounded-lg shadow-sm"
            >
              <Home className="size-4" />
              <span>Back to Homepage</span>
            </Button>
          </Link>

          <Link href="/services/service-areas" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-xs sm:text-sm font-bold gap-2 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <span>Service Areas</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Need dispatch help?</span>
          <a
            href="tel:7746221884"
            className="font-bold text-[#0060AF] hover:underline flex items-center gap-1.5"
          >
            <Phone className="size-3.5" />
            <span>(774) 622-1884</span>
          </a>
        </div>
      </div>
    </div>
  );
}
