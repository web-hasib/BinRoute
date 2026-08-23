"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetServiceAreasQuery } from "@/redux/api/service-area/serviceAreaApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useJsApiLoader } from "@react-google-maps/api";
import { 
  ArrowRight, 
  Building2, 
  Loader2, 
  MapPin, 
  ChevronDown, 
  Check, 
  Phone, 
  ShieldCheck, 
  Clock, 
  X,
  Layers
} from "lucide-react";
import { DumpTruckIcon } from "@/components/icons";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { IServiceArea, IServiceAreaPlan } from "@/types/global";

const LIBRARIES: ("places")[] = ["places"];

const POPULAR_TOWNS = [
  "Worcester", 
  "Shrewsbury", 
  "Auburn", 
  "Millbury", 
  "Holden", 
  "Westborough", 
  "Grafton", 
  "Northborough"
];

interface GoogleAutocompleteSuggestion {
  description: string;
  place_id: string;
}

const servicesMapping: Record<string, { label: string; description: string; badge: string; icon: any }> = {
  COMMERCIAL: {
    label: "Commercial Dumpster Service",
    description: "Scheduled recurring pickups & heavy disposal for businesses and job sites.",
    badge: "Commercial",
    icon: Building2,
  },
  ROLL_OFF: {
    label: "Roll-Off Dumpster Rental",
    description: "Driveway-safe container for home cleanouts, remodels, roofing, and demo.",
    badge: "Residential & Contractor",
    icon: DumpTruckIcon,
  },
};

const ServiceAreaSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-3.5 w-full">
          <Skeleton className="size-10 rounded-lg shrink-0" />
          <div className="space-y-2 w-[55%]">
            <Skeleton className="h-5 w-[70%] rounded-md" />
            <Skeleton className="h-3.5 w-[45%] rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
      </div>
    ))}
  </div>
);

const ServiceAreaList = () => {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const router = useRouter();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Record<string, string>>({});
  const [search, setSearch] = useState(initialSearch);
  const [addressInput, setAddressInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [suggestions, setSuggestions] = useState<GoogleAutocompleteSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES,
  });

  // Sync URL search param changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) {
      setSearch(urlSearch);
      setAddressInput(urlSearch);
    }
  }, [searchParams, search]);

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

  // Autocomplete fetch with debounce
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
          componentRestrictions: { country: "us" },
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
    }, 500);

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
      const mapDiv = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }

    placesService.current.getDetails(
      { placeId: suggestion.place_id, fields: ["address_components", "formatted_address"] },
      (place, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place?.address_components) return;

        const components = place.address_components;
        const streetNumber = components.find((c) => c.types.includes("street_number"))?.long_name || "";
        const route = components.find((c) => c.types.includes("route"))?.short_name || "";
        const city =
          components.find((c) => c.types.includes("neighborhood"))?.long_name ||
          components.find((c) => c.types.includes("sublocality"))?.long_name ||
          components.find((c) => c.types.includes("locality"))?.long_name ||
          "";
        const state = components.find((c) => c.types.includes("administrative_area_level_1"))?.short_name || "";
        const zip = components.find((c) => c.types.includes("postal_code"))?.long_name || "";

        const street = streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber;

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

  const handleQuickTownClick = (town: string) => {
    if (search.toLowerCase() === town.toLowerCase()) {
      setSearch("");
      setAddressInput("");
      updateUrl("");
    } else {
      setAddressInput(town);
      setSearch(town);
      setShouldSearch(false);
      setShowDropdown(false);
      updateUrl(town);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (suggestions.length > 0 && addressInput.trim() !== "") {
      handleSuggestionClick(suggestions[0]);
    } else {
      setSearch(addressInput);
      updateUrl(addressInput);
    }
    setShowDropdown(false);
  };

  const backendSearchTerm = search.match(/\b\d{5}\b/)?.[0] || search;

  const { data: areasData, isLoading } = useGetServiceAreasQuery({
    isActive: true,
    searchTerm: backendSearchTerm,
    page,
    limit,
  });

  const areas: IServiceArea[] = areasData?.data || [];
  const totalCount = areasData?.meta?.total || areas.length;

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleServiceSelect = (locationId: string, serviceId: string) => {
    setSelectedService((prev) => ({ ...prev, [locationId]: serviceId }));
  };

  const handleContinue = (locationId: string) => {
    const serviceId = selectedService[locationId];
    if (!serviceId) return;

    const area = areas.find((a) => a.id === locationId);
    const areaPlan = area?.plans?.find((p) => p.id === serviceId);
    const category = areaPlan?.plan?.category;
    const type = category === "ROLL_OFF" ? "roll-off" : "commercial";

    const zipCode = search || (area?.postalCodes && area.postalCodes[0]) || "";

    router.push(`/services/booking?areaId=${locationId}&dumstar=${serviceId}&type=${type}&zipCode=${zipCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Search Header */}
      <section className="relative w-full bg-slate-950 py-16 md:py-24 border-b border-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/95 to-slate-950 z-0" />
        
        <div className="container relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Category Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-300 bg-white/5 border border-slate-700/60 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
              <MapPin className="size-3.5 text-sky-400" />
              Central Massachusetts Delivery Coverage
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold mb-3 leading-tight tracking-wide uppercase text-white"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Check Service Availability <br className="hidden sm:inline" />
            <span className="text-sky-400">in Your Town</span>
          </motion.h1>

          <motion.p
            className="text-xs sm:text-sm md:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Enter your street address, town, or 5-digit zip code across Greater Worcester to view instant container inventory and pricing.
          </motion.p>

          {/* Search Input with Google Places Autocomplete */}
          <motion.div
            className="relative max-w-2xl mx-auto mb-6 text-left"
            ref={dropdownRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row bg-white rounded-xl p-1.5 border border-slate-200 shadow-2xl shadow-black/40"
            >
              <div className="flex items-center flex-1 px-3.5 py-2.5 sm:py-0 relative">
                <MapPin className="text-[#0060AF] size-5 mr-2.5 shrink-0" />
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
                  placeholder="Enter street, town, or zip (e.g. Worcester, Shrewsbury, 01602)..."
                  className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="size-4 animate-spin text-slate-400" />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="h-11 px-6 text-xs sm:text-sm font-bold shrink-0 rounded-lg shadow-sm"
                disabled={isSearching}
              >
                <span>Check Availability</span>
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden text-left animate-in fade-in duration-100">
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
          </motion.div>

          {/* Quick Select Town Filter Chips */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-slate-400 font-medium mr-1">Popular Areas:</span>
            {POPULAR_TOWNS.map((town) => {
              const isActive = search.toLowerCase() === town.toLowerCase();
              return (
                <button
                  key={town}
                  type="button"
                  onClick={() => handleQuickTownClick(town)}
                  className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#0060AF] text-white border-[#0060AF] shadow-xs"
                      : "bg-white/10 text-slate-300 border-white/10 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {town}
                </button>
              );
            })}
          </motion.div>

          {/* Trust strip inline */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-8 mt-8 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-sky-400" />
              <span>Driveway Protection Guaranteed</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-sky-400" />
              <span>Next-Day Delivery Available</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <Phone className="size-4 text-sky-400" />
              <span>Dispatch: (774) 622-1884</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto max-w-5xl px-4 py-12">
        {/* Results Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Service Area Coverage</span>
              {!isLoading && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0060AF] border border-blue-200">
                  {totalCount} {totalCount === 1 ? "Location" : "Locations"}
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Click any town to inspect available roll-off container sizes and book online.
            </p>
          </div>

          {search && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Filtered by: <strong className="text-slate-800">&quot;{search}&quot;</strong>
              </span>
              <button
                onClick={() => {
                  setSearch("");
                  setAddressInput("");
                  updateUrl("");
                }}
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-3" />
                <span>Clear Filter</span>
              </button>
            </div>
          )}
        </div>

        {/* List of Delivery Areas */}
        {isLoading ? (
          <ServiceAreaSkeleton />
        ) : areas.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
            <div className="size-14 rounded-full bg-blue-50 text-[#0060AF] flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <MapPin className="size-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No matching service area found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
              We frequently expand our routes across Worcester County. If you don&apos;t see your town listed for &quot;{search}&quot;, our dispatch team can provide a direct quote.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setAddressInput("");
                  updateUrl("");
                }}
                className="text-xs font-semibold"
              >
                View All Service Areas
              </Button>
              <a href="tel:7746221884">
                <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5">
                  <Phone className="size-3.5" />
                  <span>Call Dispatch (774) 622-1884</span>
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {areas.map((loc) => {
              const isOpen = expandedId === loc.id;
              const selected = selectedService[loc.id];
              const planCount = loc.plans?.length || 0;

              return (
                <div
                  key={loc.id}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? "border-[#0060AF] shadow-md shadow-blue-900/5 ring-1 ring-[#0060AF]/20" 
                      : "border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {/* Location Card Header Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(loc.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-slate-50/70 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen 
                          ? "bg-[#0060AF] text-white" 
                          : "bg-blue-50 text-[#0060AF] border border-blue-100"
                      }`}>
                        <MapPin className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {loc.address}
                          </h3>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {planCount} {planCount === 1 ? "Option" : "Container Sizes"}
                          </span>
                        </div>
                        {loc.postalCodes && loc.postalCodes.length > 0 && (
                          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                            Zip Codes: {loc.postalCodes.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="hidden md:inline-block text-xs font-semibold text-[#0060AF]">
                        {isOpen ? "Hide Options" : "View Container Sizes"}
                      </span>
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                          isOpen 
                            ? "rotate-180 bg-blue-50 text-[#0060AF]" 
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ChevronDown className="size-4" />
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Container Selection Drawer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-slate-100 bg-slate-50/80"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                              <Layers className="size-4 text-[#0060AF]" />
                              <span>Select Your Dumpster Size or Commercial Plan:</span>
                            </h4>
                            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                              Delivery to {loc.address}
                            </span>
                          </div>

                          {/* Grid of Container / Plan Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                            {loc.plans?.map((areaPlan: IServiceAreaPlan) => {
                              const planInfo = areaPlan.plan;
                              const isRollOff = planInfo.category === "ROLL_OFF";
                              const mapping = servicesMapping[planInfo.category] || {
                                label: planInfo.category.replace("_", " "),
                                description: planInfo.extraInfo || "Disposal service",
                                badge: "Service Plan",
                                icon: Building2,
                              };
                              const Icon = mapping.icon;
                              const isSelected = selected === areaPlan.id;

                              return (
                                <button
                                  key={areaPlan.id}
                                  type="button"
                                  onClick={() => handleServiceSelect(loc.id, areaPlan.id)}
                                  className={`relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-white border-[#0060AF] shadow-md shadow-blue-900/10 ring-2 ring-[#0060AF]/20"
                                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                                  }`}
                                >
                                  {/* Icon / Size Container */}
                                  <div
                                    className={`size-11 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold transition-colors ${
                                      isSelected
                                        ? "bg-[#0060AF] text-white"
                                        : "bg-blue-50 text-[#0060AF] border border-blue-100"
                                    }`}
                                  >
                                    {isRollOff ? (
                                      <>
                                        <DumpTruckIcon className="size-5" />
                                        <span className="text-[9px] uppercase tracking-tighter mt-0.5">
                                          {planInfo.dumpsterSize?.split(" ")[0] || "Bin"}
                                        </span>
                                      </>
                                    ) : (
                                      <Icon className="size-5" />
                                    )}
                                  </div>

                                  {/* Plan Info */}
                                  <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                                        {planInfo.dumpsterSize ? `${planInfo.dumpsterSize} Container` : mapping.label}
                                      </span>
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                                        {mapping.badge}
                                      </span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">
                                      {planInfo.extraInfo || mapping.description}
                                    </p>
                                  </div>

                                  {/* Radio Check Indicator */}
                                  <div
                                    className={`absolute top-4 right-4 size-5 rounded-full border flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "bg-[#0060AF] border-[#0060AF] text-white shadow-xs"
                                        : "border-slate-300 bg-white"
                                    }`}
                                  >
                                    {isSelected && <Check className="size-3.5 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Action Footer Bar */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                            <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
                              {selected ? (
                                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                                  <Check className="size-4 text-emerald-600" />
                                  Ready to configure delivery date & driveway placement.
                                </span>
                              ) : (
                                <span className="text-slate-500">
                                  Please select a container size above to proceed.
                                </span>
                              )}
                            </div>

                            <Button
                              onClick={() => handleContinue(loc.id)}
                              disabled={!selected}
                              variant="primary"
                              size="default"
                              className="w-full sm:w-auto px-6 text-xs sm:text-sm font-bold gap-2 rounded-lg shadow-sm"
                            >
                              <span>Continue to Booking</span>
                              <ArrowRight className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {!isLoading && areas.length > 0 && areasData?.meta && areasData.meta.totalPage > 1 && (
          <div className="mt-10 flex justify-center">
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
      </section>
    </div>
  );
};

export default ServiceAreaList;