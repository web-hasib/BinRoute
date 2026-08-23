"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Next.js Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm text-center">
        {/* Alert Badge */}
        <div className="size-14 mx-auto rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0060AF] mb-5">
          <AlertTriangle className="size-7 text-[#0060AF]" />
        </div>

        {/* Header */}
        <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mb-2">
          System Notice
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
          Application Error
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          We encountered an unexpected issue while loading this section. You can reload the application or return to the main hub.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-6 text-xs sm:text-sm font-bold gap-2 rounded-lg shadow-sm"
          >
            <RotateCcw className="size-4" />
            <span>Reload Application</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-xs sm:text-sm font-bold gap-2 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Home className="size-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        {/* Quick Dispatch Contact Banner */}
        <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-[#0060AF]" />
            <span className="font-semibold text-slate-800">Need immediate booking?</span>
          </div>
          <a
            href="tel:7746221884"
            className="font-bold text-[#0060AF] hover:underline"
          >
            (774) 622-1884
          </a>
        </div>

        {/* Expandable Technical Details for Developers/Debugging */}
        {error && (
          <div className="pt-2 border-t border-slate-100 text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              type="button"
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 font-semibold py-1 cursor-pointer"
            >
              <span>Technical error details</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${
                  showDetails ? "rotate-180 text-[#0060AF]" : ""
                }`}
              />
            </button>

            {showDetails && (
              <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto max-h-36 border border-slate-800 space-y-1">
                <p className="text-rose-400 font-bold">
                  {error.message || "An unexpected runtime error occurred."}
                </p>
                {error.digest && (
                  <p className="text-slate-400 text-[11px]">
                    Digest: {error.digest}
                  </p>
                )}
                {error.stack && (
                  <p className="text-slate-500 text-[10px] whitespace-pre-wrap line-clamp-4">
                    {error.stack}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
