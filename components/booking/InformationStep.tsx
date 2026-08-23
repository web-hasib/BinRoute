"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin, Calendar, ChevronDown, Search, Loader2, LocateFixed } from "lucide-react";
import { updateBookingData, updateContactInfo, setSubscriptionData, setQuoteData } from "@/feature/user/bookingSlice";
import PricingSidebar from "./PricingSidebar";
import { cn } from "@/lib/utils";
import { useCreateSubscriptionMutation, useGetQuoteMutation } from "@/redux/api/subscription/subscriptionApi";
import { useGetServiceAreaByIdQuery } from "@/redux/api/service-area/serviceAreaApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useJsApiLoader } from "@react-google-maps/api";
import { z } from "zod";

const LIBRARIES: ("places")[] = ["places"];

interface GoogleAutocompleteSuggestion {
  description: string;
  place_id: string;
}

interface GooglePlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    }
  };
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
  
  const { data: areaData, isLoading: isLoadingArea } = useGetServiceAreaByIdQuery(areaId || "", {
    skip: !areaId
  });

  // Google Maps Logic
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  })

  const [addressInput, setAddressInput] = useState(booking.dropOffAddress || "")
  const [suggestions, setSuggestions] = useState<GoogleAutocompleteSuggestion[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [shouldSearch, setShouldSearch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)

  // Sync initial address
  useEffect(() => {
    if (booking.dropOffAddress && !addressInput) {
      setAddressInput(booking.dropOffAddress)
    }
  }, [booking.dropOffAddress])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Google Search Logic
  useEffect(() => {
    if (!isLoaded || addressInput.length < 3 || !shouldSearch) {
      if (!shouldSearch) setShowDropdown(false);
      setSuggestions([])
      return
    }

    if (!autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    }

    const delayDebounce = setTimeout(() => {
      setIsSearching(true)
      autocompleteService.current?.getPlacePredictions(
        { input: addressInput },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5))
            setShowDropdown(true)
          } else {
            setSuggestions([])
          }
          setIsSearching(false)
        }
      )
    }, 600)

    return () => clearTimeout(delayDebounce)
  }, [addressInput, isLoaded, shouldSearch])

  const handleSuggestionClick = (suggestion: GoogleAutocompleteSuggestion) => {
    if (!placesService.current) {
      const mapDiv = document.createElement('div')
      placesService.current = new window.google.maps.places.PlacesService(mapDiv)
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

            // Validation: Ensure the selected address is within the service area's allowed postal codes or the city/state matches
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
            // Fallback 1: Try to extract from text
            const addressText = place.formatted_address || suggestion.description;
            const zipMatch = addressText.match(/\b\d{5}\b/);
            
            if (zipMatch) {
              checkAndSetAddress(zipMatch[0]);
            } else {
              // Fallback 2: Reverse Geocode to find missing zip
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
    )
  }

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
      (error) => {
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

  // Clear service days if frequency changes
  useEffect(() => {
    if (isCommercial) {
      handleInputChange("serviceDays", []);
    }
  }, [booking.serviceFrequency]);

  const handleContactChange = (field: string, value: string) => {
    dispatch(updateContactInfo({ [field]: value }));
  };

  const handleConfirmBooking = async () => {
    try {
      // Find the actual planId from area data
      const selectedPlan = areaData?.data?.plans?.find((p: any) => p.id === dumpsterSize);
      const planId = selectedPlan?.planId;

      if (!planId) {
        toast.error("Please select a service plan first.");
        return;
      }

      // Basic validation
      if (!contactInfo.firstName || !contactInfo.email || !contactInfo.phone || !contactInfo.companyName || !booking.dropOffAddress) {
        toast.error("Please fill in all required contact and schedule information.");
        return;
      }

      if (!isCommercial && (!booking.dropOffDate || !booking.pickUpDate)) {
        toast.error("Please select both Drop-off Date and Pick-up Date for Roll-Off plans.");
        return;
      }

      const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      // If quoteData is missing, user needs to get a quote first
      if (!booking.quoteData) {
        toast.error("Please calculate your quote first.");
        return;
      }

      const payload: any = {
        planId,
        dropoffAddress: booking.dropOffAddress,
        dropoffDate: new Date(booking.dropOffDate || Date.now()).toISOString(),
        dropoffLatitude: booking.dropoffLatitude || 23.8,
        dropoffLongitude: booking.dropoffLongitude || 90.42,
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
        // Filter out any short names (like "Mon") and only send full day names
        payload.serviceDays = (booking.serviceDays || [])
          .filter(day => validDays.includes(day));
        
        if (payload.serviceDays.length === 0) {
          payload.serviceDays = ["Monday"]; // Fallback to at least one day
        }
      } else {
        payload.pickupDate = new Date(booking.pickUpDate).toISOString();
        payload.rentalDuration = "0"; // As per roll-off example
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
      // Find the actual planId from area data
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
          payload.serviceDays = ["Monday"]; // Fallback
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
      {/* Left Column: Forms */}
      <div className={cn("space-y-6 transition-all duration-300", booking.quoteData ? "lg:col-span-8" : "lg:col-span-12")}>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0265AF] transition-colors mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Service Selection
        </button>

        {/* Schedule Details */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-8">Schedule Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {/* Drop-off Address */}
            <div className="md:col-span-2 space-y-2 relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-[#0c243c]">Dumpster Drop-off Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={isCommercial ? "150 Cambridge St Boston, MA 02114" : "Enter full address..."}
                  value={addressInput}
                  onChange={(e) => {
                    setAddressInput(e.target.value)
                    setShouldSearch(true)
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true)
                  }}
                  className="w-full pl-12 pr-20 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="text-[#0265AF] hover:text-[#1a3857] transition-colors p-1.5 bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center group"
                    title="Use current location"
                  >
                    <LocateFixed className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  ) : (
                    <Search className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Suggestions Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-start gap-3 transition-colors border-b last:border-none border-gray-100"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 line-clamp-1">{suggestion.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className={cn("space-y-2", isCommercial && "md:col-span-2")}>
              <label className="text-sm font-semibold text-[#0c243c]">
                Dumpster Drop-off Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={booking.dropOffDate}
                  onChange={(e) => handleInputChange("dropOffDate", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                {!booking.dropOffDate && (
                  <Calendar className="absolute hidden right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                )}
              </div>
            </div>

            {!isCommercial && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0c243c]">Dempster Pick-up Date</label>
                <div className="relative">
                  <input
                    type="date"
                    min={booking.dropOffDate || new Date().toISOString().split("T")[0]}
                    value={booking.pickUpDate}
                    onChange={(e) => handleInputChange("pickUpDate", e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                  />
                  {!booking.pickUpDate && (
                    <Calendar className="absolute hidden right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>
            )}

            {/* Business & Waste Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Business Type</label>
              <div className="relative">
                <select
                  value={booking.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none appearance-none"
                >
                  <option value="">Select Business Type</option>
                  {businessTypeEnum.options.map((type) => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Waste Type</label>
              <div className="relative">
                <select
                  value={booking.wasteType}
                  onChange={(e) => handleInputChange("wasteType", e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none appearance-none"
                >
                  <option value="">Select Waste Type</option>
                  {wasteTypeEnum.options.map((type) => (
                    <option key={type} value={type}>{formatLabel(type)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Commercial Specific Sections */}
          {isCommercial && (
            <div className="mt-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#0c243c]">Service Frequency</label>
                <div className="grid grid-cols-3 gap-3">
                  {serviceFrequencies.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => handleInputChange("serviceFrequency", freq)}
                      className={cn(
                        "py-3 px-4 text-xs font-medium border-2 transition-all",
                        booking.serviceFrequency === freq
                          ? "border-[#0265AF] text-[#0265AF] shadow-sm bg-white"
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#E6F4EA] p-4 border border-[#D1E7D6]">
                <p className="text-[11px] text-[#1E7E34] leading-relaxed">
                  <span className="font-bold">Note:</span> Pricing depends on container size and pickup frequency. Additional charges may apply for weight, materials, or extended service areas.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#0c243c]">Select Contract Duration</h4>
                <div className="grid grid-cols-3 gap-3">
                  {contractDurations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => handleInputChange("contractDuration", duration)}
                      className={cn(
                        "py-3 px-4 text-xs font-medium border-2 transition-all",
                        booking.contractDuration === duration
                          ? "border-[#0265AF] text-[#0265AF] shadow-sm bg-white"
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#0c243c]">Select New Service Days</h4>
                <div className="grid grid-cols-7 gap-2">
                  {serviceDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={cn(
                        "py-3 px-1 text-[10px] font-medium border transition-all text-center",
                        booking.serviceDays?.includes(day)
                          ? "border-[#0265AF] text-[#0265AF] bg-[#EBF6FF]"
                          : "border-gray-100 text-gray-400 hover:border-gray-200"
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

        {/* Contact Info */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-8">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">First Name</label>
              <input
                type="text"
                placeholder={isCommercial ? "Miller" : "Cooper"}
                value={contactInfo.firstName}
                onChange={(e) => handleContactChange("firstName", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Last name</label>
              <input
                type="text"
                placeholder={isCommercial ? "Robert" : "Warren"}
                value={contactInfo.lastName}
                onChange={(e) => handleContactChange("lastName", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Email Address</label>
              <input
                type="email"
                placeholder={isCommercial ? "robert@example.com" : "nevaeh.simmons@example.com"}
                value={contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Phone Number</label>
              <input
                type="text"
                required
                placeholder={isCommercial ? "(555) 123-4567" : "703 123 214"}
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Company Name</label>
              <input
                type="text"
                required
                placeholder={isCommercial ? "Miller Construction LLC" : "Enter your company name..."}
                value={contactInfo.companyName}
                onChange={(e) => handleContactChange("companyName", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">
                {isCommercial ? "Note (Optional)" : "Delivery Instructions"}
              </label>
              <textarea
                placeholder={isCommercial ? "Enter any special requests or instructions here." : "Enter any special requests or instructions here..."}
                rows={4}
                value={contactInfo.deliveryInstructions}
                onChange={(e) => handleContactChange("deliveryInstructions", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Get Quote Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleGetQuote}
            disabled={isGettingQuote}
            className="bg-[#0c243c] text-white px-8 py-3 rounded-none font-bold text-sm hover:bg-[#1a3857] transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isGettingQuote && <Loader2 className="w-4 h-4 animate-spin" />}
            {isGettingQuote ? "Calculating..." : "Get Quote"}
          </button>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar */}
      {booking.quoteData && (
        <div className="lg:col-span-4">
          <PricingSidebar 
             buttonText={isSubscribing ? "Processing..." : (isCommercial ? "Continue Booking" : "Confirm Booking")}
             onButtonClick={handleConfirmBooking}
          />
        </div>
      )}
    </div>
  );
};

export default InformationStep;
