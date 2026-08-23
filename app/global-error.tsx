"use client";

import React, { useState } from "react";
import { AlertTriangle, RotateCcw, Home, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans text-slate-900">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm text-center">
          <div className="size-14 mx-auto rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0060AF] mb-5">
            <AlertTriangle className="size-7 text-[#0060AF]" />
          </div>

          <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mb-2">
            Application Notice
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            An unexpected global error occurred. You can reload the application to restore your session.
          </p>

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

            <a href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-xs sm:text-sm font-bold gap-2 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Home className="size-4" />
                <span>Return to Homepage</span>
              </Button>
            </a>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-[#0060AF]" />
              <span className="font-semibold text-slate-800">Dispatch Assistance:</span>
            </div>
            <a
              href="tel:7746221884"
              className="font-bold text-[#0060AF] hover:underline"
            >
              (774) 622-1884
            </a>
          </div>

          {error && (
            <div className="pt-2 border-t border-slate-100 text-left">
              <button
                onClick={() => setShowDetails(!showDetails)}
                type="button"
                className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 font-semibold py-1 cursor-pointer"
              >
                <span>Technical details</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    showDetails ? "rotate-180 text-[#0060AF]" : ""
                  }`}
                />
              </button>

              {showDetails && (
                <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto max-h-36 border border-slate-800 space-y-1">
                  <p className="text-rose-400 font-bold">
                    {error.message || "An unexpected error occurred."}
                  </p>
                  {error.digest && (
                    <p className="text-slate-400 text-[11px]">
                      Digest: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
