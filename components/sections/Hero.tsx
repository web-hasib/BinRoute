"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useJsApiLoader } from "@react-google-maps/api";

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
    <section className="relative h-[450px] sm:h-[550px] lg:h-[calc(90vh-100px)] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Dumpster Rentals"
          fill
          className=""
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/0 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent z-11" />
      </div>

      {/* Content */}
      <div className="container relative z-20 text-center text-[#FAFDFF] mt-20">
        <h1 className="text-2xl sm:text-3xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
          Dumpster Rentals in <br />
          Greater Worcester MA
        </h1>
        <p className="text-xs sm:text-sm md:text-md font-medium mb-10 max-w-lg mx-auto opacity-90">
          Fast and easy waste removal for homes, contractors, and local
          businesses across Worcester County MA.
        </p>

        {/* Search Bar with Autocomplete */}
        <div className="relative max-w-lg mx-auto" ref={dropdownRef}>
          <form 
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row bg-white rounded-none overflow-hidden shadow-sm"
          >
            <div className="flex items-center flex-1 px-4 py-4 md:py-0 border-b md:border-b-0 relative">
              <MapPin className="text-[#1f74ba] size-5 mr-3 shrink-0" />
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
                placeholder="1114 Blue Hill Avenue, Dorchester Center, MA 02124"
                defaultValue={""}
                className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-500 font-normal text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <Button 
              type="submit"
              className="bg-linear-to-t from-[#0061AA] to-[#279CF5] h-12 hover:bg-[#279CF5] text-white font-semibold rounded-none px-6 py-7 md:py-0 text-md transition-colors"
              disabled={isSearching}
            >
              Search
            </Button>
          </form>

          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-none overflow-hidden text-left">
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
      </div>
    </section>
  );
};

export default Hero;
