"use client";

import { useGetServiceAreasQuery } from "@/redux/api/service-area/serviceAreaApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useJsApiLoader } from "@react-google-maps/api";
import { ArrowRight, Building2, Loader2, MapPin, Search, Wrench, ChevronDown, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";

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

const servicesMapping = {
  COMMERCIAL: {
    label: "Commercial Container Service",
    description: "Scheduled recurring pickup & heavy disposal for commercial facilities.",
    icon: Building2,
  },
  ROLL_OFF: {
    label: "Roll-Off Dumpster Rental",
    description: "Temporary roll-off container for cleanouts, remodels, and construction.",
    icon: Wrench,
  },
};

const ServiceAreaSkeleton = () => (
  <div className="flex flex-col gap-2.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-[2px] border border-slate-200 px-5 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="h-5 w-5 rounded-[2px] shrink-0" />
          <Skeleton className="h-4 w-[40%] rounded-[2px]" />
        </div>
        <Skeleton className="h-4 w-4 rounded-[2px] shrink-0" />
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) {
      setSearch(urlSearch);
      setAddressInput(urlSearch);
    }
  }, [searchParams, search]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  });

  const [addressInput, setAddressInput] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState<GoogleAutocompleteSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        { 
          input: addressInput,
          componentRestrictions: { country: "us" }
        },
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

  const updateUrl = (searchValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    setPage(1);
    router.replace(`/services/service-areas?${params.toString()}`, { scroll: false });
  };

  const handleSuggestionClick = (suggestion: GoogleAutocompleteSuggestion) => {
    setAddressInput(suggestion.description);
    setShouldSearch(false);
    setShowDropdown(false);

    if (!placesService.current) {
      const mapDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }

    placesService.current.getDetails(
      { placeId: suggestion.place_id, fields: ['address_components', 'formatted_address'] },
      (place, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place?.address_components) return;

        const components = place.address_components;
        const streetNumber = components.find(c => c.types.includes("street_number"))?.long_name || "";
        const route = components.find(c => c.types.includes("route"))?.short_name || "";
        const city = components.find(c => c.types.includes("neighborhood"))?.long_name ||
          components.find(c => c.types.includes("sublocality"))?.long_name ||
          components.find(c => c.types.includes("locality"))?.long_name || "";
        const state = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";
        const zip = components.find(c => c.types.includes("postal_code"))?.long_name || "";

        const street = streetNumber && route ? `${streetNumber} ${route}` : (route || streetNumber);
        
        let finalSearch = "";
        if (street) finalSearch += `${street}, `;
        if (city) finalSearch += `${city}, `;
        if (state) finalSearch += `${state} `;
        if (zip) finalSearch += zip;
        
        finalSearch = finalSearch.trim().replace(/,$/, "");
        setSearch(finalSearch);
        updateUrl(finalSearch);
      }
    );
  };

  const backendSearchTerm = search.match(/\b\d{5}\b/)?.[0] || search;

  const { data: areasData, isLoading } = useGetServiceAreasQuery({
    isActive: true,
    searchTerm: backendSearchTerm,
    page,
    limit,
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
    
    const zipCode = search || (area?.postalCodes && area.postalCodes[0]) || "";

    router.push(`/services/booking?areaId=${locationId}&dumstar=${serviceId}&type=${type}&zipCode=${zipCode}`);
  };

  const areas = areasData?.data || [];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Search Banner */}
      <div className="w-full px-4 py-16 md:py-20 bg-[#0B132B] text-white border-b border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <span className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            Worcester County Delivery Network
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 leading-tight">
            Check Service Availability in Your Town
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xl mx-auto">
            Enter your street address, town, or 5-digit zip code to verify delivery coverage and view active container inventory.
          </p>

          <div className="relative text-left" ref={dropdownRef}>
            <div className="flex flex-col sm:flex-row gap-2 bg-white p-1 rounded-[2px] border border-slate-300 shadow-sm">
              <div className="relative flex-1 flex items-center px-3 py-2 sm:py-0">
                <Search className="size-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => {
                    setAddressInput(e.target.value);
                    setShouldSearch(true);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Enter address, city, or zip (e.g. Worcester, Shrewsbury, 01602)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                />
                {isSearching && (
                  <Loader2 className="size-4 animate-spin text-slate-400 shrink-0 ml-2" />
                )}
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  if (suggestions.length > 0 && addressInput.trim() !== "") {
                    handleSuggestionClick(suggestions[0]);
                  } else {
                    setSearch(addressInput);
                    updateUrl(addressInput);
                  }
                  setShowDropdown(false);
                }}
                disabled={isSearching}
                className="px-5 text-xs sm:text-sm font-bold"
              >
                <span>Check Address</span>
              </Button>
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-[2px] shadow-lg overflow-hidden animate-in fade-in duration-100">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm hover:bg-slate-50 flex items-start gap-2.5 transition-colors border-b last:border-none border-slate-100 font-medium text-slate-800"
                  >
                    <MapPin className="size-4 text-[#005FA3] mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{suggestion.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Available Delivery Locations
            </h2>
            <p className="text-xs text-slate-500">
              Select your town below to view container sizes and start your booking.
            </p>
          </div>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setAddressInput("");
                updateUrl("");
              }}
              className="text-xs text-[#005FA3] font-bold hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        {isLoading ? (
          <ServiceAreaSkeleton />
        ) : (
          <div className="space-y-2.5">
            {areas.length === 0 ? (
              <div className="text-center py-14 bg-white rounded-[2px] border border-slate-200 text-slate-500 text-xs sm:text-sm">
                No service areas found matching &quot;{search}&quot;. Please contact our dispatch team directly at (774) 622-1884 for custom delivery requests.
              </div>
            ) : (
              areas.map((loc: any) => {
                const isOpen = expandedId === loc.id;
                const selected = selectedService[loc.id];

                return (
                  <div
                    key={loc.id}
                    className="bg-white rounded-[2px] border border-slate-200 overflow-hidden shadow-2xs transition-all"
                  >
                    {/* Row header */}
                    <button
                      onClick={() => handleToggle(loc.id)}
                      className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-6.5 rounded-[2px] bg-blue-50 border border-blue-200 flex items-center justify-center text-[#005FA3] shrink-0">
                          <MapPin className="size-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {loc.address}
                        </span>
                      </div>
                      <div
                        className={`size-6 rounded-[2px] bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 bg-blue-50 text-[#005FA3]" : ""
                        }`}
                      >
                        <ChevronDown className="size-3.5" />
                      </div>
                    </button>

                    {/* Collapsible service cards */}
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 bg-[#f8fafc]">
                        <p className="text-xs font-bold text-slate-700 mb-2.5">
                          Select a container or service option for this location:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
                          {loc.plans?.map((areaPlan: any) => {
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
                                className={`flex items-start gap-3 p-3.5 rounded-[2px] border text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-white border-[#005FA3] ring-1 ring-[#005FA3] shadow-2xs"
                                    : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div className={`size-8 rounded-[2px] flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-blue-50 text-[#005FA3] border border-blue-200" : "bg-slate-100 text-slate-600"
                                }`}>
                                  <Icon className="size-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">
                                    {mapping.label}
                                  </p>
                                  <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Size: {planInfo.dumpsterSize} • {mapping.description}
                                  </p>
                                </div>

                                <div
                                  className={`size-4 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5 ${
                                    isSelected
                                      ? "bg-[#005FA3] border-[#005FA3] text-white"
                                      : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {isSelected && <Check className="size-3" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Continue button */}
                        <div className="flex justify-end pt-2 border-t border-slate-200">
                          <Button
                            onClick={() => handleContinue(loc.id)}
                            disabled={!selected}
                            variant="primary"
                            size="sm"
                            className="gap-1.5 text-xs font-bold px-4"
                          >
                            <span>Continue to Booking</span>
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && areas.length > 0 && areasData?.meta && areasData.meta.totalPage > 1 && (
          <div className="mt-8">
            <CustomPagination
              currentPage={page}
              totalPages={areasData.meta.totalPage || 1}
              onPageChange={(newPage) => setPage(newPage)}
              rowsPerPage={limit}
              onRowsPerPageChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceAreaList;