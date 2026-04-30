"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, ArrowDown, Search, Building2, Wrench, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetServiceAreasQuery } from "@/redux/api/service-area/serviceAreaApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES: ("places")[] = ["places"];

interface GoogleAutocompleteSuggestion {
  description: string;
  place_id: string;
}

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlaceDetails {
  place_id: string;
  formatted_address: string;
  address_components: GoogleAddressComponent[];
}

const servicesMapping = {
  COMMERCIAL: {
    label: "Commercial Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Building2,
  },
  ROLL_OFF: {
    label: "Roll off Dumpster Service",
    description: "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Wrench,
  },
};

const ServiceAreaSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-100 px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="h-5 w-5 rounded-full shrink-0" />
          <Skeleton className="h-4 w-[40%] rounded-md" />
        </div>
        <Skeleton className="h-4 w-4 rounded-md shrink-0" />
      </div>
    ))}
  </div>
);

const ServiceAreaList = () => {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Record<string, string>>({});
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  // Google Maps Logic
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  })

  const [addressInput, setAddressInput] = useState(initialSearch)
  const [suggestions, setSuggestions] = useState<GoogleAutocompleteSuggestion[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [shouldSearch, setShouldSearch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)

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
      { placeId: suggestion.place_id, fields: ['address_components', 'formatted_address'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.address_components) {
          const postalCode = place.address_components.find(c => c.types.includes("postal_code"))?.long_name
          
          if (postalCode) {
            setSearch(postalCode)
          } else {
            // Fallback to formatted address or first part of address if no postal code
            setSearch(suggestion.description)
          }
        }
      }
    )
  }

  const { data: areasData, isLoading } = useGetServiceAreasQuery({
    isActive: true,
    searchTerm: search,
  });

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleServiceSelect = (locationId: string, serviceId: string) => {
    setSelectedService((prev) => ({ ...prev, [locationId]: serviceId }));
  };

  const handleContinue = (locationId: string) => {
    const serviceId = selectedService[locationId];
    if (!serviceId) return;
    
    const area = areas.find(a => a.id === locationId);
    const areaPlan = area?.plans?.find(p => p.id === serviceId);
    const category = areaPlan?.plan?.category;
    const type = category === "ROLL_OFF" ? "roll-off" : "commercial";
    
    // If search is empty, use the first postal code of the selected area as a default
    const zipCode = search || (area?.postalCodes && area.postalCodes[0]) || "";

    router.push(`/services/booking?areaId=${locationId}&dumstar=${serviceId}&type=${type}&zipCode=${zipCode}`);
  };

  const areas = areasData?.data || [];

  return (
    <div className="min-h-screen bg-[#F6F6F6] font-sans">
      {/* Hero Search Banner */}
      <div
        className="w-full px-4 py-20"
        style={{
          background: "linear-gradient(135deg, #0f2942 0%, #1a4a7a 55%, #1e6ba8 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Please select your area below
          </h1>
          <div className="flex gap-2 relative" ref={dropdownRef}>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => {
                  setAddressInput(e.target.value)
                  setShouldSearch(true)
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowDropdown(true)
                }}
                placeholder="Enter your address..."
                className="w-full pl-10 pr-10 py-3 text-sm text-gray-700 bg-white rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearching && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
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
            <button
              onClick={() => {
                if (addressInput) {
                  setSearch(addressInput)
                  setShowDropdown(false)
                }
              }}
              className="px-6 py-3 text-white text-sm font-semibold rounded-md transition hover:bg-blue-600 disabled:opacity-50"
              style={{ background: "#2563eb" }}
              disabled={isSearching}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">
          All Service Area
        </h2>

        {isLoading ? (
          <ServiceAreaSkeleton />
        ) : (
          <div className="flex flex-col gap-3">
            {areas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-100 italic text-gray-400">
                No service areas found matching your search.
              </div>
            ) : (
              areas.map((loc) => {
                const isOpen = expandedId === loc.id;
                const selected = selectedService[loc.id];

                return (
                  <div
                    key={loc.id}
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden"
                    style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}
                  >
                    {/* Row header */}
                    <button
                      onClick={() => handleToggle(loc.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium text-left">
                          {loc.address}
                        </span>
                      </div>
                      {isOpen ? (
                        <ArrowDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {/* Collapsible service cards */}
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {loc.plans?.map((areaPlan) => {
                            const planInfo = areaPlan.plan;
                            const mapping = servicesMapping[planInfo.category as keyof typeof servicesMapping] || {
                              label: planInfo.category.replace("_", " "),
                              description: planInfo.extraInfo || "Disposal service",
                              icon: Building2,
                            };
                            
                            const Icon = mapping.icon;
                            const isSelected = selected === areaPlan.id;

                            return (
                              <button
                                key={areaPlan.id}
                                onClick={() => handleServiceSelect(loc.id, areaPlan.id)}
                                className="flex items-start gap-4 p-4 rounded-lg border text-left transition-all"
                                style={{
                                  borderColor: isSelected ? "#2563eb" : "#e5e7eb",
                                  background: isSelected ? "#eff6ff" : "#fff",
                                }}
                              >
                                {/* Icon box */}
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ background: "#f1f5f9" }}
                                >
                                  <Icon className="h-5 w-5 text-gray-700" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 mb-1">
                                    {mapping.label}
                                  </p>
                                  <p className="text-xs text-gray-400 leading-relaxed">
                                    Size: {planInfo.dumpsterSize} - {mapping.description}
                                  </p>
                                </div>

                                {/* Checkbox */}
                                <div
                                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                                  style={{
                                    borderColor: isSelected ? "#2563eb" : "#d1d5db",
                                    background: isSelected ? "#2563eb" : "#fff",
                                  }}
                                >
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Continue button */}
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleContinue(loc.id)}
                            disabled={!selected}
                            className="px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              background: selected ? "#2563eb" : "#93c5fd",
                              boxShadow: selected ? "0 4px 12px 0 rgba(37,99,235,0.3)" : "none",
                            }}
                          >
                            Continue your booking
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceAreaList;