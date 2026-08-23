"use client";

import React, { Suspense } from "react";
import BookingFlow from "@/components/booking/BookingFlow";
import { Skeleton } from "@/components/ui/skeleton";

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 max-w-6xl py-8 space-y-6">
            <Skeleton className="h-16 w-full max-w-2xl mx-auto rounded-xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        }
      >
        <BookingFlow />
      </Suspense>
    </div>
  );
};

export default BookingPage;
