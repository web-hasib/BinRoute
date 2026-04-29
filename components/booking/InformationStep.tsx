"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { MapPin, Calendar, ChevronDown, Search, Loader2 } from "lucide-react";
import { updateBookingData, updateContactInfo, setSubscriptionData } from "@/feature/user/bookingSlice";
import PricingSidebar from "./PricingSidebar";
import { cn } from "@/lib/utils";
import { useCreateSubscriptionMutation } from "@/redux/api/subscription/subscriptionApi";
import { useGetServiceAreaByIdQuery } from "@/redux/api/service-area/serviceAreaApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useJsApiLoader } from "@react-google-maps/api";

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

const businessTypes = [
  "Commercial Office Building",
  "Schools",
  "Supermarkets",
  "Manufacturing",
  "Medical Facilities",
  "Restaurants Full Service",
  "Warehouse",
  "Other",
];

const wasteTypes = ["Trash", "Recycle"];

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

  const { data: areaData } = useGetServiceAreaByIdQuery(areaId || "");
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();

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
    setAddressInput(suggestion.description)
    setShouldSearch(false)
    setShowDropdown(false)

    if (!placesService.current) {
      const mapDiv = document.createElement('div')
      placesService.current = new window.google.maps.places.PlacesService(mapDiv)
    }

    placesService.current.getDetails(
      { placeId: suggestion.place_id, fields: ['geometry', 'formatted_address'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          
          dispatch(updateBookingData({
            dropOffAddress: place.formatted_address || suggestion.description,
            dropoffLatitude: lat,
            dropoffLongitude: lng
          }))
        }
      }
    )
  }

  const handleInputChange = (field: string, value: any) => {
    dispatch(updateBookingData({ [field]: value }));
  };

  const handleDayToggle = (day: string) => {
    const currentDays = booking.serviceDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    handleInputChange("serviceDays", newDays);
  };

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
      if (!contactInfo.firstName || !contactInfo.email || !booking.dropOffAddress) {
        toast.error("Please fill in all required contact and schedule information.");
        return;
      }

      const payload: any = {
        planId,
        dropoffAddress: booking.dropOffAddress,
        dropoffDate: new Date(booking.dropOffDate || Date.now()).toISOString(),
        dropoffLatitude: booking.dropoffLatitude || 23.8,
        dropoffLongitude: booking.dropoffLongitude || 90.42,
        businessType: booking.businessType || "Other",
        wasteType: booking.wasteType || "Trash",
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
        payload.serviceDays = booking.serviceDays?.length ? booking.serviceDays : ["Monday"];
      } else {
        payload.pickupDate = booking.pickUpDate ? new Date(booking.pickUpDate).toISOString() : null;
        payload.rentalDuration = "0"; // As per roll-off example
      }

      const response = await createSubscription(payload).unwrap();
      
      if (response.success) {
        // Handle the weird key with spaces for client secret
        const clientSecret = response.data?.["   "] || response.data?.clientSecret;
        const subscriptionId = response.data?.subscription?.id;

        dispatch(setSubscriptionData({
          clientSecret,
          subscriptionId
        }));

        toast.success("Booking initiated! Moving to payment...");
        onNext();
      }
    } catch (error: any) {
      console.error("Subscription Error:", error);
      toast.error(error?.data?.message || "Failed to initiate booking. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Forms */}
      <div className="lg:col-span-8 space-y-6">
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
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
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
                Dempster Drop-off Date
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
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
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
                  {wasteTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
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
                placeholder={isCommercial ? "(555) 123-4567" : "703 123 214"}
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-[#0c243c]">Company Name (Optional)</label>
              <input
                type="text"
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
      </div>

      {/* Right Column: Pricing Sidebar */}
      <div className="lg:col-span-4">
        <PricingSidebar 
           buttonText={isLoading ? "Processing..." : (isCommercial ? "Continue Booking" : "Confirm Booking")}
           onButtonClick={handleConfirmBooking}
        />
      </div>
    </div>
  );
};

export default InformationStep;
