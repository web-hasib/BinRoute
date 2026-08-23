"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Loader2, ShieldCheck, Clock, Star, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useJsApiLoader } from "@react-google-maps/api";
import { motion } from "framer-motion";

const LIBRARIES: ("places")[] = ["places"];

interface GoogleAutocompleteSuggestion {
  description: string;
  place_id: string;
}

const Hero = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<GoogleAutocompleteSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  });

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

  // Fetch suggestions with US restriction
  useEffect(() => {
    if (!isLoaded || searchValue.length < 3) {
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
          input: searchValue,
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
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, isLoaded]);

  const handleSuggestionClick = (suggestion: GoogleAutocompleteSuggestion) => {
    setSearchValue(suggestion.description);
    setShowDropdown(false);

    if (!placesService.current) {
      const mapDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }

    placesService.current.getDetails(
      { placeId: suggestion.place_id, fields: ['address_components', 'formatted_address'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.address_components) {
          const postalCode = place.address_components.find(c => c.types.includes("postal_code"))?.long_name;
          
          const streetNumber = place.address_components.find(c => c.types.includes("street_number"))?.long_name || "";
          const route = place.address_components.find(c => c.types.includes("route"))?.short_name || "";
          const city = place.address_components.find(c => c.types.includes("neighborhood"))?.long_name || 
                       place.address_components.find(c => c.types.includes("sublocality"))?.long_name ||
                       place.address_components.find(c => c.types.includes("locality"))?.long_name || "";
          const state = place.address_components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";
          const zip = place.address_components.find(c => c.types.includes("postal_code"))?.long_name || "";

          const street = streetNumber && route ? `${streetNumber} ${route}` : (route || streetNumber);
          
          let finalSearch = "";
          if (street) finalSearch += `${street}, `;
          if (city) finalSearch += `${city}, `;
          if (state) finalSearch += `${state} `;
          if (zip) finalSearch += zip;
          
          finalSearch = finalSearch.trim().replace(/,$/, "");
          router.push(`/services/service-areas?search=${encodeURIComponent(finalSearch)}`);
        }
      }
    );
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchValue.trim()) {
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      } else {
        router.push(`/services/service-areas?search=${encodeURIComponent(searchValue.trim())}`);
      }
    }
  };

  return (
    <section className="relative min-h-[520px] md:min-h-[580px] w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-[#EEF6FF] via-[#F8FAFC] to-white py-16 md:py-24 border-b border-slate-200">
      {/* Roll-Off Dumpster Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/hero.png"
          alt="Labonte Roll-Off Dumpster Service"
          fill
          className="object-cover opacity-15 filter brightness-105 contrast-105 mix-blend-multiply"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/85 via-white/75 to-[#F8FAFC]/95 z-10" />
      </div>

      {/* Background Decorative Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-linear-to-r from-blue-200/30 via-sky-200/25 to-blue-200/30 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="container relative z-20 text-center max-w-5xl mx-auto px-4">
        {/* Clean Eyebrow Category */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-md mb-3">
            Central Massachusetts Waste Removal
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-[1.1] text-slate-900 tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Roll-Off Dumpsters Delivered Across <br className="hidden sm:inline" />
          <span className="text-[#0060AF]">Greater Worcester, MA</span>
        </motion.h1>

        <motion.p 
          className="text-xs sm:text-sm md:text-base font-normal mb-8 max-w-2xl mx-auto text-slate-600 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          Transparent flat-rate pricing with generous tonnage included. Next-day delivery for residential cleanouts, roofing jobs, and construction sites.
        </motion.p>

        {/* Search Bar with Autocomplete */}
        <motion.div 
          className="relative max-w-xl mx-auto mb-6" 
          ref={dropdownRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <form 
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row bg-white rounded-xl p-1.5 border border-slate-300 shadow-md shadow-slate-200/60"
          >
            <div className="flex items-center flex-1 px-3.5 py-2.5 sm:py-0 relative">
              <MapPin className="text-[#0060AF] size-4.5 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowDropdown(true);
                }}
                placeholder="Enter street or town (e.g. Worcester, Shrewsbury, Auburn)..."
                className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
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
              <span>Check Rates</span>
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </form>

          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-left animate-in fade-in duration-100">
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

        {/* Dispatch Phone Callout */}
        <motion.p 
          className="text-xs text-slate-500 mb-8 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Need a container placed today? Call dispatch directly at{" "}
          <a href="tel:7746221884" className="text-[#0060AF] font-bold underline hover:text-[#004D8C]">
            (774) 622-1884
          </a>
        </motion.p>

        {/* Live Trust Metrics Badges */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto pt-6 border-t border-slate-200/80 text-xs"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 bg-white p-3 border border-slate-200 rounded-xl shadow-xs text-slate-700">
            <ShieldCheck className="size-4 text-[#0060AF] shrink-0" />
            <span className="font-semibold">Driveway Protection Included</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white p-3 border border-slate-200 rounded-xl shadow-xs text-slate-700">
            <Clock className="size-4 text-[#0060AF] shrink-0" />
            <span className="font-semibold">Guaranteed Next-Day Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white p-3 border border-slate-200 rounded-xl shadow-xs text-slate-700">
            <Star className="size-4 text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-semibold">5.0 Star Worcester Rated</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
