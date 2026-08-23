import React, { Suspense } from "react";
import ServiceAreaList from "@/components/sections/ServiceAreaList";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceAreasPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 py-20">
            <div className="container mx-auto max-w-5xl px-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        }
      >
        <ServiceAreaList />
      </Suspense>
    </main>
  );
}
