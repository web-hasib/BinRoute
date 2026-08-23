"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import { useGetServiceAreaByIdQuery } from "@/redux/api/service-area/serviceAreaApi";

const LIBRARIES: ("places")[] = ["places"];

interface PricingSidebarProps {
  buttonText: string;
  onButtonClick: () => void;
}

const PricingSidebar = ({ buttonText, onButtonClick }: PricingSidebarProps) => {
  const { dumpsterSize, pricing, serviceType, serviceFrequency, quoteData, dropoffLatitude, dropoffLongitude } = useSelector((state: RootState) => state.booking);
  const isCommercial = serviceType === "commercial";
  const searchParams = useSearchParams();
  const areaId = searchParams.get("areaId");

  const { data: areaData } = useGetServiceAreaByIdQuery(areaId || "", {
    skip: !areaId,
  });

  const selectedPlan = areaData?.data?.plans?.find((p: any) => p.id === dumpsterSize);
  const dumpsterName = selectedPlan?.plan?.dumpsterSize ? `${selectedPlan.plan.dumpsterSize} Dumpster` : (dumpsterSize ? dumpsterSize.replace("-", " ") : "Container");

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  });

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  const officeLocation = React.useMemo(() => ({
    lat: Number(process.env.NEXT_PUBLIC_OFFICE_LATITUDE) || 42.2173,
    lng: Number(process.env.NEXT_PUBLIC_OFFICE_LONGITUDE) || -71.6917,
  }), []);

  useEffect(() => {
    if (!isLoaded || !dropoffLatitude || !dropoffLongitude) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: officeLocation,
        destination: { lat: dropoffLatitude, lng: dropoffLongitude },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  }, [isLoaded, dropoffLatitude, dropoffLongitude, officeLocation]);

  return (
    <div className="space-y-4 sticky top-24">
      {/* Title Card */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
          Instant Order Summary
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
          {isCommercial ? "Commercial Service Pricing" : "Transparent Flat-Rate Pricing"}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Dispatched from Central Hub: Grafton, MA
        </p>
      </div>

      {/* Map / Distance Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={officeLocation}
              zoom={10}
              options={{
                disableDefaultUI: true,
                zoomControl: false,
              }}
            >
              {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: "#0060AF",
                      strokeWeight: 4,
                    }
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <span className="text-xs font-semibold text-slate-500">Calculating route...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 border-t border-slate-100">
          <div className="size-9 rounded-lg bg-blue-50 text-[#0060AF] flex items-center justify-center shrink-0 border border-blue-100">
            <MapPin className="size-4.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {quoteData?.distanceInMiles !== undefined ? `${quoteData.distanceInMiles} Miles` : (isCommercial ? "Standard Distance" : "Calculated at Drop-off")}
            </h4>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-tight">Delivery Route Distance</p>
          </div>
        </div>
      </div>

      {/* Driveway Protection Notice */}
      <div className="bg-emerald-50 rounded-xl p-3.5 text-emerald-800 text-xs leading-relaxed border border-emerald-200 flex items-start gap-2.5">
        <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Driveway Protection Included:</span>
          Wood blocking laid under all rollers to protect pavers & asphalt.
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Selected Container</span>
          <span className="text-xs font-bold text-slate-900">{dumpsterName}</span>
        </div>

        {isCommercial && (
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Service Frequency</span>
            <span className="text-xs font-bold text-slate-900">{serviceFrequency}</span>
          </div>
        )}

        {!isCommercial && (
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Standard Rental</span>
            <span className="text-xs font-bold text-slate-900">7 Days Included</span>
          </div>
        )}

        {/* Breakdown */}
        <div className="space-y-2.5 pt-1">
          {quoteData?.breakdown ? (
            quoteData.breakdown.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">{item.label}</span>
                <span className="font-bold text-slate-900">
                  {item.amount < 0 ? `-$${Math.abs(item.amount).toFixed(2)}` : `$${item.amount.toFixed(2)}`}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">Base Container Rental</span>
                <span className="font-bold text-slate-900">${pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">State & Environmental Tax (6%)</span>
                <span className="font-bold text-slate-900">${pricing.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">Service Area Delivery Fee</span>
                <span className="font-bold text-slate-900">${pricing.fee.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Total amount */}
        <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
          <div>
            <span className="text-sm font-bold text-slate-900 block">Total Due</span>
            <span className="text-[10px] text-slate-400 font-medium">Transparent flat rate</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            ${quoteData ? quoteData.totalPrice.toFixed(2) : pricing.total.toFixed(2)}
          </span>
        </div>

        <Button 
          onClick={onButtonClick}
          variant="primary"
          size="lg"
          className="w-full h-12 text-xs sm:text-sm font-bold rounded-xl shadow-md mt-2"
        >
          {buttonText}
        </Button>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium">
          By clicking &quot;{buttonText}&quot;, you agree to our Terms of Service. Payment is authorized securely via Stripe.
        </p>
      </div>
    </div>
  );
};

export default PricingSidebar;
