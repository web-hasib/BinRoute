"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Loader2, ShieldCheck, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useJsApiLoader } from "@react-google-maps/api";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const heroRef = useRef<HTMLElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const router = useRouter();

  // Scroll parallax effect on the hero background
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES,
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
  }, [searchValue, isLoaded]);

  const handleSuggestionClick = (suggestion: GoogleAutocompleteSuggestion) => {
    setSearchValue(suggestion.description);
    setShowDropdown(false);

    if (!placesService.current) {
      const mapDiv = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }

    placesService.current.getDetails(
      { placeId: suggestion.place_id, fields: ["address_components", "formatted_address"] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.address_components) {
          const streetNumber =
            place.address_components.find((c) => c.types.includes("street_number"))?.long_name || "";
          const route =
            place.address_components.find((c) => c.types.includes("route"))?.short_name || "";
          const city =
            place.address_components.find((c) => c.types.includes("neighborhood"))?.long_name ||
            place.address_components.find((c) => c.types.includes("sublocality"))?.long_name ||
            place.address_components.find((c) => c.types.includes("locality"))?.long_name ||
            "";
          const state =
            place.address_components.find((c) => c.types.includes("administrative_area_level_1"))?.short_name || "";
          const zip =
            place.address_components.find((c) => c.types.includes("postal_code"))?.long_name || "";

          const street = streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber;

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
    <section
      ref={heroRef}
      className="relative min-h-[560px] md:min-h-[740px] lg:min-h-[860px] w-full overflow-hidden flex items-center justify-center bg-slate-950 py-16 md:py-24 border-b border-slate-800"
    >
      {/* Parallax Background Image Layer */}
      <motion.div
        className="absolute inset-0 z-0 h-[125%] -top-[10%] w-full overflow-hidden"
        style={{ y: backgroundY }}
      >
        <Image
          src="/hero.png"
          alt="Labonte Roll-Off Dumpster Service"
          fill
          className="object-cover object-center brightness-[0.4] contrast-[1.05]"
          priority
        />
        {/* Natural Dark Photographic Vignette & Clean Contrast Overlay (No AI Glow / Gradients) */}
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-slate-950/90" />
      </motion.div>

      {/* Content */}
      <div className="container relative z-20 text-center max-w-5xl lg:max-w-6xl mx-auto px-4">
        {/* Authentic Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-slate-100 bg-white/5 border border-slate-700/60 px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-sm mb-4 lg:mb-6 shadow-sm backdrop-blur-sm">
            Central Massachusetts Waste Removal
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-thin mb-4 lg:mb-6 leading-[1.08] text-white"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Roll-Off Dumpsters Delivered Across <br className="hidden sm:inline" />
          <span className="text-[70%] font-thin tracking-tighter   text-sky-400/80">Greater Worcester, MA</span>
        </motion.h1>

        <motion.p
          className="text-xs sm:text-sm md:text-base lg:text-lg font-normal mb-8 lg:mb-12 max-w-2xl lg:max-w-3xl mx-auto text-slate-200 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          Transparent flat-rate pricing with generous tonnage included. Next-day delivery for residential cleanouts, roofing jobs, and construction sites.
        </motion.p>

        {/* Search Bar with Autocomplete */}
        <motion.div
          className="relative max-w-xl lg:max-w-2xl mx-auto mb-4 lg:mb-6"
          ref={dropdownRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row bg-white rounded-xl lg:rounded-2xl p-1.5 lg:p-2 border border-slate-200 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center flex-1 px-3.5 lg:px-4 py-2.5 sm:py-0 relative">
              <MapPin className="text-[#0060AF] size-5 lg:size-5.5 mr-2.5 lg:mr-3 shrink-0" />
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
                className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm lg:text-base"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin text-slate-400" />
                </div>
              )}
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="h-11 lg:h-12 px-6 lg:px-8 text-xs sm:text-sm lg:text-base font-bold shrink-0 rounded-lg lg:rounded-xl shadow-sm"
              disabled={isSearching}
            >
              <span>Check Rates</span>
              <ArrowRight className="size-4 lg:size-4.5 ml-1" />
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
                  className="w-full px-4 py-3 text-left text-xs sm:text-sm lg:text-base hover:bg-blue-50/70 flex items-start gap-2.5 transition-colors border-b last:border-none border-slate-100 text-slate-800 font-medium cursor-pointer"
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
          className="text-xs lg:text-sm text-slate-300 mb-8 lg:mb-12 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Need a container placed today? Call dispatch directly at{" "}
          <a href="tel:7746221884" className="text-sky-300 font-bold underline hover:text-sky-200 transition-colors">
            (774) 622-1884
          </a>
        </motion.p>

        {/* Clean Inline Trust Metrics (No Cards) */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-y-3 lg:gap-y-4 gap-x-6 sm:gap-x-8 lg:gap-x-12 max-w-4xl lg:max-w-5xl mx-auto pt-6 lg:pt-10 border-t border-slate-800/80 text-xs sm:text-sm lg:text-base font-medium text-slate-300"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 lg:gap-2.5">
            <ShieldCheck className="size-4.5 lg:size-5 text-sky-400 shrink-0" />
            <span>Driveway Protection Included</span>
          </div>

          <span className="hidden sm:inline-block text-slate-600 select-none">•</span>

          <div className="flex items-center gap-2 lg:gap-2.5">
            <Clock className="size-4.5 lg:size-5 text-sky-400 shrink-0" />
            <span>Guaranteed Next-Day Delivery</span>
          </div>

          <span className="hidden sm:inline-block text-slate-600 select-none">•</span>

          <div className="flex items-center gap-2 lg:gap-2.5">
            <Star className="size-4.5 lg:size-5 text-amber-400 fill-amber-400 shrink-0" />
            <span>5.0 Star Worcester Rated</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
