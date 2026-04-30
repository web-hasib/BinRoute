"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES: ("places")[] = ["places"];

interface PricingSidebarProps {
  buttonText: string;
  onButtonClick: () => void;
}

const PricingSidebar = ({ buttonText, onButtonClick }: PricingSidebarProps) => {
  const { dumpsterSize, pricing, serviceType, serviceFrequency, quoteData, dropoffLatitude, dropoffLongitude } = useSelector((state: RootState) => state.booking);
  const isCommercial = serviceType === "commercial";

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  });

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  const officeLocation = React.useMemo(() => ({
    lat: Number(process.env.NEXT_PUBLIC_OFFICE_LATITUDE) ,
    lng: Number(process.env.NEXT_PUBLIC_OFFICE_LONGITUDE) 
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
      <div className="bg-[#0c243c] p-6 text-white shadow-sm">
        <h3 className="text-xl font-bold">
          {isCommercial ? "Transparent Roll og Pricing" : "Transparent Roll-Off Pricing"}
        </h3>
        <p className="text-[10px] text-gray-400 mt-1">Distance-Based Pricing (From 103 Creeper Rd, Grafton, MA)</p>
      </div>

      {/* Map/Distance Card */}
      <div className="bg-white border border-gray-100 p-1 space-y-4 shadow-sm">
        <div className="relative h-100 lg:h-70 bg-gray-100 overflow-hidden">
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
                        strokeColor: "#0265AF",
                        strokeWeight: 4,
                      }
                    }}
                  />
                )}
              </GoogleMap>
           ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-500">Loading map...</span>
              </div>
           )}
        </div>
        <div className="flex items-center gap-3 p-4">
            <div className="p-2.5 bg-gray-50 rounded-sm">
              <MapPin className="w-5 h-5 text-[#0c243c]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0c243c]">
                {quoteData?.distanceInMiles !== undefined ? `${quoteData.distanceInMiles} Miles` : (isCommercial ? "42.4 Miles" : "0.0 Miles")}
              </h4>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Calculated Distance</p>
            </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#E6F4EA] p-4 text-[#1E7E34] text-[11px] leading-relaxed border border-[#D1E7D6]">
         Note: Delivery distance charges apply automatically: +$100 for 30-60 miles and +$150 for over 60 miles.
      </div>

      {/* Details Card */}
      <div className="bg-white border border-gray-100 p-6 space-y-5 shadow-sm">
        <div className="flex justify-between items-center pb-2">
          <span className="text-xs text-gray-500 font-medium">Dumpster Size</span>
          <span className="text-xs font-bold text-[#0c243c]">{dumpsterSize?.replace("-", " ") || "2 Yard Dumpster"}</span>
        </div>

        {isCommercial && (
          <div className="flex justify-between items-center pb-2 mt-[-8px]">
            <span className="text-xs text-gray-500 font-medium">Service Frequency</span>
            <span className="text-xs font-bold text-[#0c243c]">{serviceFrequency}</span>
          </div>
        )}

        {!isCommercial && (
          <div className="flex justify-between items-center pb-2 mt-[-8px]">
            <span className="text-xs text-gray-500 font-medium">Rental Duration</span>
            <span className="text-xs font-bold text-[#0c243c]">---</span>
          </div>
        )}

        {/* Separator if needed */}
        <div className="border-t border-gray-50 pt-3 space-y-3.5">
          {quoteData?.breakdown ? (
            quoteData.breakdown.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">{item.label}</span>
                <span className="font-bold text-[#0c243c]">
                  {item.amount < 0 ? `-$${Math.abs(item.amount).toFixed(2)}` : `$${item.amount.toFixed(2)}`}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold text-[#0c243c]">${pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Environmental Tax (6%)</span>
                <span className="font-bold text-[#0c243c]">${pricing.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Service Area Fee</span>
                <span className="font-bold text-[#0c243c]">${pricing.fee.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
           <span className="text-lg font-bold text-[#0c243c]">
             Total amount
           </span>
           <span className="text-lg font-bold text-[#0c243c]">
             ${quoteData ? quoteData.totalPrice.toFixed(2) : pricing.total.toFixed(2)}
           </span>
        </div>

        <Button 
          onClick={onButtonClick}
          className="w-full bg-[#0265AF] hover:bg-[#004d85] text-white py-7 rounded-none font-bold text-sm"
        >
          {buttonText}
        </Button>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed font-medium">
          By clicking &quot;{buttonText}&quot;, you agree to our <span className="text-[#0265AF] underline">Terms of Service</span> and Rental Agreement. This rental is non-refundable once dispatched.
        </p>
      </div>
    </div>
  );
};

export default PricingSidebar;
