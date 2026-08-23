"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBillingInfoQuery, useGetMySubscriptionsQuery } from "@/redux/api/subscription/subscriptionApi";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ManagePlansPage = () => {
  const { data: billingInfoResponse, isLoading: isBillingLoading } = useGetBillingInfoQuery(undefined);
  const { data: subsResponse, isLoading: isSubsLoading } = useGetMySubscriptionsQuery({ limit: 50 });

  const billingInfo = billingInfoResponse?.data;
  const subscriptions = subsResponse?.data?.data || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button */}
      <Link 
        href="/dashboard/user/billing-payment" 
        className="flex items-center gap-2 text-[#172C41] hover:text-[#0061AA] transition-colors font-medium text-sm"
      >
        <ArrowLeft className="size-4" /> Back to billing
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#172C41]">Manage plan & services</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review, pause, or remove your active waste disposal services.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Service Card */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-gray-600 font-medium text-base mb-4">Active service</p>
          {isBillingLoading ? (
            <Skeleton className="h-10 w-12" />
          ) : (
            <h2 className="text-4xl font-bold text-[#0061AA] mb-2">{billingInfo?.totalActivePlans || 0}</h2>
          )}
          <p className="text-gray-400 text-sm">0 paused</p>
        </div>

        {/* Next Billing Date Card */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-gray-600 font-medium text-base mb-4">Next billing date</p>
          {isBillingLoading ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <h2 className="text-3xl font-bold text-[#0061AA] mb-2 uppercase">
              {billingInfo?.nextBillingInfo?.nextBillingDate ? 
                new Date(billingInfo.nextBillingInfo.nextBillingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }) : "N/A"}
            </h2>
          )}
          <p className="text-gray-400 text-sm">Auto-renews monthly</p>
        </div>

       
      </div>

      {/* Services List Section */}
      <div className="bg-white border border-gray-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#172C41]">Your services</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by :</span>
            <button className="flex items-center gap-4 bg-gray-50 px-4 py-2 border border-gray-100 font-bold text-xs text-[#172C41]">
              ALL <ChevronDown className="size-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {isSubsLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))
          ) : subscriptions.length > 0 ? (
            subscriptions.map((sub: any) => (
              <div key={sub.id} className="bg-[#F8F9FA] border border-gray-100 overflow-hidden">
                <div className="p-8 flex justify-between items-start">
                  <div className="flex gap-6">
                    <div className="size-24 bg-white border border-gray-100 flex items-center justify-center p-2">
                        {sub.plan?.image ? (
                            <Image 
                                src={sub.plan.image} 
                                alt="Service" 
                                width={80} 
                                height={80} 
                                className="object-contain"
                            />
                        ) : (
                            <div className="size-full bg-gray-50 flex items-center justify-center text-gray-300">No Image</div>
                        )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#172C41]">{sub.plan?.category.replace("_", " ")} dumpster booking Service</h3>
                      <p className="text-gray-500 font-medium text-sm">{sub.plan?.dumpsterSize || "N/A"}</p>
                      <p className="text-gray-500 font-medium text-sm">{sub.serviceFrequency || "N/A"}</p>
                      <p className="text-gray-500 font-medium text-sm">{sub.contractDuration || "N/A"} contract</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest",
                    sub.status === "ACTIVE" ? "bg-[#22C55E] text-white" : "bg-orange-100 text-orange-600"
                  )}>
                    {sub.status}
                  </span>
                </div>
                <div className="px-8 py-6 border-t border-gray-100 flex flex-col justify-end">
                    <h4 className="text-2xl font-black text-[#172C41]">${sub.totalAmount || "0.00"}</h4>
                    <p className="text-gray-400 text-sm font-medium">Per month</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 text-gray-400">
              No active services found.
            </div>
          )}
        </div>

        {/* Add Service Section */}
        <div className="mt-8 bg-[#F8F9FA] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-[#172C41]">Add a new service</h3>
            <p className="text-gray-500 text-sm mt-1">Browse available waste disposal options for your area</p>
          </div>
          <Link href="/services/service-areas">
            <Button className="bg-[#0061AA] hover:bg-[#004e89] text-white px-8 py-6 rounded-none font-bold flex items-center gap-2">
                <Plus className="size-5" /> Add service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagePlansPage;
