"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin, Calendar, ChevronDown, Search, Loader2, LocateFixed, ArrowLeft, Building2, User, Phone, Mail, FileText, CheckCircle } from "lucide-react";
import { updateBookingData, updateContactInfo, setSubscriptionData, setQuoteData } from "@/feature/user/bookingSlice";
import PricingSidebar from "./PricingSidebar";
import { cn } from "@/lib/utils";
import { useCreateSubscriptionMutation, useGetQuoteMutation } from "@/redux/api/subscription/subscriptionApi";
import { useGetServiceAreaByIdQuery } from "@/redux/api/service-area/serviceAreaApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useJsApiLoader } from "@react-google-maps/api";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const LIBRARIES: ("places")[] = ["places"];

interface GoogleAutocompleteSuggestion {
  description: string;
  place_id: string;
}

interface InformationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const businessTypeEnum = z.enum([
  'warehouse',
  'commercial_office_building',
  'medical_facilities',
  'schools',
  'supermarkets',
  'manufacturing',
  'restaurants',
  'other',
]);

const wasteTypeEnum = z.enum(['trash', 'recycle']);

const formatLabel = (val: string) => {
  return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const serviceFrequencies = [
  "1x/week",
  "2x/week",
  "3x/week",
  "4x/week",
  "5x/week",
  "6x/week",
  "7x/week",
  "Every other week",
  "Once a month",
  "Twice a month",
];

const serviceDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const contractDurations = ["1 year", "2 year", "3 year"];

const InformationStep = ({ onNext, onBack }: InformationStepProps) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const areaId = searchParams.get("areaId");
  
  const booking = useSelector((state: RootState) => state.booking);
  const { contactInfo, serviceType, dumpsterSize } = booking;
  const isCommercial = serviceType === "commercial";

  const [createSubscription, { isLoading: isSubscribing }] = useCreateSubscriptionMutation();
  const [getQuote, { isLoading: isGettingQuote }] = useGetQuoteMutation();
  
  const { data: areaData } = useGetServiceAreaByIdQuery(areaId || "", {
    skip: !areaId
  });

  // Google Maps Logic
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  });

  const [addressInput, setAddressInput] = useState(booking.dropOffAddress || "");
  const [suggestions, setSuggestions] = useState<GoogleAutocompleteSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Sync initial address
  useEffect(() => {
    if (booking.dropOffAddress && !addressInput) {
      setAddressInput(booking.dropOffAddress);
    }
  }, [booking.dropOffAddress, addressInput]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Google Search Logic
  useEffect(() => {
    if (!isLoaded || addressInput.length < 3 || !shouldSearch) {
      if (!shouldSearch) setShowDropdown(false);
      setSuggestions([]);
      return;
    }

    if (!autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }

    const delayDebounce = setTimeout(() => {
      setIsSearching(true);
      autocompleteService.current?.getPlacePredictions(
        { input: addressInput },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5));
            setShowDropdown(true);
          } else {
            setSuggestions([]);
          }
          setIsSearching(false);
        }
      );
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [addressInput, isLoaded, shouldSearch]);

  const handleSuggestionClick = (suggestion: GoogleAutocompleteSuggestion) => {
    if (!placesService.current) {
      const mapDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }

    placesService.current.getDetails(
      { placeId: suggestion.place_id, fields: ['geometry', 'formatted_address', 'address_components'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          let postalCode = place.address_components?.find(c => c.types.includes("postal_code"))?.long_name;

          const checkAndSetAddress = (finalPostalCode: string | undefined) => {
            const allowedPostalCodes = areaData?.data?.postalCodes || [];
            const areaName = areaData?.data?.name || "";
            
            const getComponent = (types: string[]) => place.address_components?.find((c: any) => c.types.some((t: string) => types.includes(t)))?.long_name;
            const placeCity = getComponent(["locality", "sublocality", "administrative_area_level_3"]);
            const placeState = getComponent(["administrative_area_level_1"]);
            const areaCity = areaData?.data?.locationInfo?.city;
            const areaState = areaData?.data?.locationInfo?.state;

            const isCityMatch = Boolean(areaCity && placeCity && areaCity.toLowerCase() === placeCity.toLowerCase() && (!areaState || !placeState || areaState.toLowerCase() === placeState.toLowerCase()));
            const serviceAreaDisplay = areaCity ? `${areaCity}${areaState ? `, ${areaState}` : ""}` : areaName;

            if (allowedPostalCodes.length > 0 && !isCityMatch) {
              if (!finalPostalCode || !allowedPostalCodes.includes(finalPostalCode)) {
                toast.error(
                  `The selected address is outside the service area for ${serviceAreaDisplay}.`
                );
                setAddressInput("");
                return;
              }
            }

            setAddressInput(place.formatted_address || suggestion.description);
            setShouldSearch(false);
            setShowDropdown(false);

            dispatch(updateBookingData({
              dropOffAddress: place.formatted_address || suggestion.description,
              dropoffLatitude: lat,
              dropoffLongitude: lng
            }));
          };

          if (!postalCode) {
            const addressText = place.formatted_address || suggestion.description;
            const zipMatch = addressText.match(/\b\d{5}\b/);
            
            if (zipMatch) {
              checkAndSetAddress(zipMatch[0]);
            } else {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ location: { lat, lng } }, (results, geoStatus) => {
                let foundZip = postalCode;
                if (geoStatus === "OK" && results && results.length > 0) {
                  for (const result of results) {
                    const pc = result.address_components?.find(c => c.types.includes("postal_code"))?.long_name;
                    if (pc) {
                      foundZip = pc;
                      break;
                    }
                  }
                }
                checkAndSetAddress(foundZip);
              });
            }
          } else {
            checkAndSetAddress(postalCode);
          }
        }
      }
    );
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, geoStatus) => {
          setIsSearching(false);
          if (geoStatus === "OK" && results && results.length > 0) {
            const place = results[0];
            
            let postalCode = place.address_components?.find(c => c.types.includes("postal_code"))?.long_name;
            const addressText = place.formatted_address;
            
            if (!postalCode) {
              const zipMatch = addressText.match(/\b\d{5}\b/);
              if (zipMatch) {
                postalCode = zipMatch[0];
              }
            }

            const allowedPostalCodes = areaData?.data?.postalCodes || [];
            const areaName = areaData?.data?.name || "";
            
            const getComponent = (types: string[]) => place.address_components?.find((c: any) => c.types.some((t: string) => types.includes(t)))?.long_name;
            const placeCity = getComponent(["locality", "sublocality", "administrative_area_level_3"]);
            const placeState = getComponent(["administrative_area_level_1"]);
            const areaCity = areaData?.data?.locationInfo?.city;
            const areaState = areaData?.data?.locationInfo?.state;

            const isCityMatch = Boolean(areaCity && placeCity && areaCity.toLowerCase() === placeCity.toLowerCase() && (!areaState || !placeState || areaState.toLowerCase() === placeState.toLowerCase()));
            const serviceAreaDisplay = areaCity ? `${areaCity}${areaState ? `, ${areaState}` : ""}` : areaName;

            if (allowedPostalCodes.length > 0 && !isCityMatch) {
              if (!postalCode || !allowedPostalCodes.includes(postalCode)) {
                toast.error(
                  `Your current location is outside the service area for ${serviceAreaDisplay}.`
                );
                return;
              }
            }

            setAddressInput(addressText);
            setShouldSearch(false);
            
            dispatch(updateBookingData({
              dropOffAddress: addressText,
              dropoffLatitude: lat,
              dropoffLongitude: lng
            }));
            
            toast.success("Current location set successfully!");
          } else {
            toast.error("Could not determine address from your location.");
          }
        });
      },
      () => {
        setIsSearching(false);
        toast.error("Failed to get your location. Please check browser permissions.");
      }
    );
  };

  const handleInputChange = (field: string, value: any) => {
    dispatch(updateBookingData({ [field]: value }));
  };

  const getFrequencyLimit = (frequency: string) => {
    if (frequency === "Every other week" || frequency === "Once a month" || frequency === "Twice a month") return 1;
    const match = frequency.match(/(\d+)x/);
    return match ? parseInt(match[1]) : 1;
  };

  const handleDayToggle = (day: string) => {
    const currentDays = booking.serviceDays || [];
    const limit = getFrequencyLimit(booking.serviceFrequency || "1x/week");

    if (currentDays.includes(day)) {
      const newDays = currentDays.filter((d) => d !== day);
      handleInputChange("serviceDays", newDays);
    } else {
      if (currentDays.length >= limit) {
        toast.error(`You can only select ${limit} day(s) for ${booking.serviceFrequency} service.`);
        return;
      }
      const newDays = [...currentDays, day];
      handleInputChange("serviceDays", newDays);
    }
  };

  useEffect(() => {
    if (isCommercial) {
      handleInputChange("serviceDays", []);
    }
  }, [booking.serviceFrequency, isCommercial]);

  const handleContactChange = (field: string, value: string) => {
    dispatch(updateContactInfo({ [field]: value }));
  };

  const handleConfirmBooking = async () => {
    try {
      const selectedPlan = areaData?.data?.plans?.find((p: any) => p.id === dumpsterSize);
      const planId = selectedPlan?.planId;

      if (!planId) {
        toast.error("Please select a service plan first.");
        return;
      }

      if (!contactInfo.firstName || !contactInfo.email || !contactInfo.phone || !contactInfo.companyName || !booking.dropOffAddress) {
        toast.error("Please fill in all required contact and schedule information.");
        return;
      }

      if (!isCommercial && (!booking.dropOffDate || !booking.pickUpDate)) {
        toast.error("Please select both Drop-off Date and Pick-up Date for Roll-Off plans.");
        return;
      }

      const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      if (!booking.quoteData) {
        toast.error("Please calculate your quote first.");
        return;
      }

      const payload: any = {
        planId,
        dropoffAddress: booking.dropOffAddress,
        dropoffDate: new Date(booking.dropOffDate || Date.now()).toISOString(),
        dropoffLatitude: booking.dropoffLatitude || 42.2626,
        dropoffLongitude: booking.dropoffLongitude || -71.8023,
        businessType: booking.businessType || "other",
        wasteType: booking.wasteType || "trash",
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        companyName: contactInfo.companyName,
        deliveryInstructions: contactInfo.deliveryInstructions,
      };

      if (isCommercial) {
        payload.serviceFrequency = booking.serviceFrequency || "1x/week";
        payload.contractDuration = booking.contractDuration || "1 year";
        payload.serviceDays = (booking.serviceDays || []).filter(day => validDays.includes(day));
        
        if (payload.serviceDays.length === 0) {
          payload.serviceDays = ["Monday"];
        }
      } else {
        payload.pickupDate = new Date(booking.pickUpDate).toISOString();
        payload.rentalDuration = "0";
      }

      const response = await createSubscription(payload).unwrap();
      
      if (response.success) {
        const clientSecret = response.data?.["   "] || response.data?.clientSecret;
        const subscriptionId = response.data?.subscription?.id;
        const distance = response.data?.distance;
        const totalAmount = response.data?.subscription?.totalAmount;

        dispatch(setSubscriptionData({
          clientSecret,
          subscriptionId,
          distance,
          totalAmount
        }));

        toast.success("Booking initiated! Moving to payment...");
        onNext();
      }
    } catch (error: any) {
      console.error("Subscription Error:", error);
      const msg = error?.data?.message || error?.data?.error || error?.message || error?.error;
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  const handleGetQuote = async () => {
    try {
      const selectedPlan = areaData?.data?.plans?.find((p: any) => p.id === dumpsterSize);
      const planId = selectedPlan?.planId;

      if (!planId) {
        toast.error("Please select a service plan first.");
        return;
      }

      if (!booking.dropOffAddress || !booking.dropoffLatitude || !booking.dropoffLongitude) {
        toast.error("Please provide a valid drop-off address.");
        return;
      }

      if (!isCommercial && (!booking.dropOffDate || !booking.pickUpDate)) {
        toast.error("Please select both Drop-off Date and Pick-up Date for Roll-Off plans.");
        return;
      }

      const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      
      const payload: any = {
        planId,
        dropoffLatitude: booking.dropoffLatitude,
        dropoffLongitude: booking.dropoffLongitude,
      };

      if (isCommercial) {
        payload.serviceFrequency = booking.serviceFrequency || "1x/week";
        payload.contractDuration = booking.contractDuration || "1 year";
        payload.serviceDays = (booking.serviceDays || []).filter(day => validDays.includes(day));
        
        if (payload.serviceDays.length === 0) {
          payload.serviceDays = ["Monday"];
        }
      } else {
        payload.dropoffDate = new Date(booking.dropOffDate).toISOString();
        payload.pickupDate = new Date(booking.pickUpDate).toISOString();
      }

      const response = await getQuote(payload).unwrap();
      if (response.success && response.data) {
        dispatch(setQuoteData(response.data));
        toast.success("Quote calculated successfully!");
      }
    } catch (error: any) {
      console.error("Quote Error:", error);
      const msg = error?.data?.message || error?.data?.error || error?.message || error?.error;
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Cards */}
      <div className={cn("space-y-6 transition-all duration-300", booking.quoteData ? "lg:col-span-8" : "lg:col-span-12")}>
        <button 
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0060AF] transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Service & Container Selection</span>
        </button>

        {/* Schedule & Placement Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0060AF]">
              Step 2.1
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Placement Address & Schedule Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your exact drop-off address in Worcester County and delivery dates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Drop-off Address Input */}
            <div className="md:col-span-2 space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-xs font-bold text-slate-800">
                Dumpster Drop-off Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-[#0060AF]" />
                <input
                  type="text"
                  placeholder={isCommercial ? "Enter commercial facility address..." : "Enter street address, town, and zip code..."}
                  value={addressInput}
                  onChange={(e) => {
                    setAddressInput(e.target.value);
                    setShouldSearch(true);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  className="w-full pl-11 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <button 
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="text-[#0060AF] hover:text-blue-900 p-1.5 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                    title="Use current location"
                  >
                    <LocateFixed className="size-4" />
                  </button>
                  {isSearching ? (
                    <Loader2 className="size-4 animate-spin text-slate-400 mr-1" />
                  ) : (
                    <Search className="size-4 text-slate-400 mr-1" />
                  )}
                </div>
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-left animate-in fade-in duration-100">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      type="button"
                      className="w-full px-4 py-3 text-left text-xs sm:text-sm hover:bg-blue-50/70 flex items-start gap-2.5 transition-colors border-b last:border-none border-slate-100 text-slate-800 font-medium cursor-pointer"
                    >
                      <MapPin className="size-4 text-[#0060AF] mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{suggestion.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Drop-off Date */}
            <div className={cn("space-y-1.5", isCommercial && "md:col-span-2")}>
              <label className="text-xs font-bold text-slate-800">
                Drop-off Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={booking.dropOffDate}
                  onChange={(e) => handleInputChange("dropOffDate", e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
                />
              </div>
            </div>

            {/* Pick-up Date for Roll-Off */}
            {!isCommercial && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Pick-up Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={booking.dropOffDate || new Date().toISOString().split("T")[0]}
                    value={booking.pickUpDate}
                    onChange={(e) => handleInputChange("pickUpDate", e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Business Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Business / Project Type</label>
              <div className="relative">
                <select
                  value={booking.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none appearance-none transition-all"
                >
                  <option value="">Select Project Type</option>
                  {businessTypeEnum.options.map((type) => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Waste Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Material / Debris Type</label>
              <div className="relative">
                <select
                  value={booking.wasteType}
                  onChange={(e) => handleInputChange("wasteType", e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none appearance-none transition-all"
                >
                  <option value="">Select Debris Type</option>
                  {wasteTypeEnum.options.map((type) => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Commercial Specific Options */}
          {isCommercial && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Pickup Frequency</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {serviceFrequencies.map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => handleInputChange("serviceFrequency", freq)}
                      className={cn(
                        "py-2.5 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer",
                        booking.serviceFrequency === freq
                          ? "bg-blue-50 text-[#0060AF] border-[#0060AF] shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Contract Duration</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {contractDurations.map((duration) => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => handleInputChange("contractDuration", duration)}
                      className={cn(
                        "py-2.5 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer",
                        booking.contractDuration === duration
                          ? "bg-blue-50 text-[#0060AF] border-[#0060AF] shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Preferred Pickup Days</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {serviceDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={cn(
                        "py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center",
                        booking.serviceDays?.includes(day)
                          ? "bg-[#0060AF] text-white border-[#0060AF]"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0060AF]">
              Step 2.2
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Contact & Delivery Verification
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Our driver will call 30 minutes prior to drop-off to confirm driveway placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="John"
                value={contactInfo.firstName}
                onChange={(e) => handleContactChange("firstName", e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={contactInfo.lastName}
                onChange={(e) => handleContactChange("lastName", e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="john@example.com"
                value={contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                placeholder="(508) 555-0123"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Company / Job Site Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Residential Cleanout or Company Name"
                value={contactInfo.companyName}
                onChange={(e) => handleContactChange("companyName", e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Driveway Placement Instructions (Optional)
              </label>
              <textarea
                placeholder="e.g. Place on the right side of the driveway near the garage door. Wood boards under wheels requested."
                rows={3}
                value={contactInfo.deliveryInstructions}
                onChange={(e) => handleContactChange("deliveryInstructions", e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Calculate Quote Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleGetQuote}
            disabled={isGettingQuote}
            variant="primary"
            size="lg"
            className="h-12 px-8 text-xs sm:text-sm font-bold gap-2 rounded-xl shadow-md"
          >
            {isGettingQuote && <Loader2 className="size-4 animate-spin" />}
            <span>{isGettingQuote ? "Calculating Route & Quote..." : "Calculate Final Quote"}</span>
          </Button>
        </div>
      </div>

      {/* Right Column: Dynamic Pricing Sidebar */}
      {booking.quoteData && (
        <div className="lg:col-span-4">
          <PricingSidebar 
            buttonText={isSubscribing ? "Processing..." : (isCommercial ? "Continue to Payment" : "Confirm & Proceed to Payment")}
            onButtonClick={handleConfirmBooking}
          />
        </div>
      )}
    </div>
  );
};

export default InformationStep;
