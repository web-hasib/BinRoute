"use client";
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Loader2, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCreateServiceAreaMutation, useGetServicePlansQuery, useGetServiceAreaByIdQuery, useUpdateServiceAreaMutation } from "@/redux/api/service-area/serviceAreaApi"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { FormSkeleton } from "@/components/ui/FormSkeleton"
import { useJsApiLoader } from "@react-google-maps/api"
import { ICreateServiceAreaPayload } from "@/types/global"
import Container from "@/components/ui/container";

const LIBRARIES: ("places")[] = ["places"];

interface ServiceAreaFormProps {
  mode: "add" | "edit"
  id?: string
}

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
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  address_components: GoogleAddressComponent[];
}

export const ServiceAreaForm = ({ mode, id }: ServiceAreaFormProps) => {
  const router = useRouter()
  const isEdit = mode === "edit"

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: LIBRARIES
  })

  // API Hooks
  const { data: plansData, isLoading: isLoadingPlans } = useGetServicePlansQuery()
  const [createServiceArea, { isLoading: isCreating }] = useCreateServiceAreaMutation()
  const [updateServiceArea, { isLoading: isUpdating }] = useUpdateServiceAreaMutation()

  // Fetch existing data if in Edit mode
  const { data: singleAreaData, isLoading: isLoadingSingle } = useGetServiceAreaByIdQuery(id as string, {
    skip: !isEdit || !id,
  })

  // States
  const [addressInput, setAddressInput] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [shouldSearch, setShouldSearch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Google Services Refs
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const mapAnchor = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<Partial<ICreateServiceAreaPayload>>({
    name: "",
    address: "",
    postalCodes: [],
    planIds: [],
    locationInfo: undefined
  })

  // Pre-populate form when in Edit mode
  useEffect(() => {
    if (isEdit && singleAreaData?.data) {
      const area = singleAreaData.data;
      console.log("Populating form with area data:", area); // Debug log

      setFormData({
        name: area.name,
        address: area.address,
        postalCodes: area.postalCodes || [],
        planIds: area.plans?.map((p) => p.planId) || [],
        locationInfo: area.locationInfo
      });

      // Crucial: Update the search input field text
      setAddressInput(area.address);
      setShouldSearch(false);
    }
  }, [isEdit, singleAreaData]);

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

  // Google Search Logic (Debounced)
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
      console.log("Searching for:", addressInput); // Debug log
      
      autocompleteService.current?.getPlacePredictions(
        { input: addressInput },
        (predictions, status) => {
          console.log("Places API Status:", status); // Debug log
          console.log("Predictions:", predictions); // Debug log
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5))
            setShowDropdown(true)
          } else {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
              console.error("Google Places Error Status:", status);
            }
            setSuggestions([])
          }
          setIsSearching(false)
        }
      )
    }, 600)

    return () => clearTimeout(delayDebounce)
  }, [addressInput, isLoaded])

  const handleSelectPlace = (suggestion: any) => {
    if (!isLoaded || !mapAnchor.current) return

    setIsSearching(true)
    if (!placesService.current) {
      placesService.current = new window.google.maps.places.PlacesService(mapAnchor.current)
    }

    placesService.current.getDetails(
      { 
        placeId: suggestion.place_id,
        fields: ['geometry', 'address_components', 'formatted_address', 'name']
      },
      async (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const getComponent = (components: any[] | undefined, type: string) => {
            const comp = components?.find(c => c.types.includes(type));
            return comp?.long_name || comp?.short_name || "";
          };

          let postcode = getComponent(place.address_components, "postal_code");
          const city = getComponent(place.address_components, "locality") || getComponent(place.address_components, "administrative_area_level_2");
          const state = getComponent(place.address_components, "administrative_area_level_1");
          const country = getComponent(place.address_components, "country");
          const areaName = getComponent(place.address_components, "sublocality") || city || "Service Area";

          // Fallback 1: Try to extract from formatted_address using regex (common for BD postal codes)
          if (!postcode && place.formatted_address) {
            const match = place.formatted_address.match(/\b\d{4,5}\b/);
            if (match) postcode = match[0];
          }

          // Fallback 2: If missing, attempt to find it by reverse geocoding coordinates
          if (!postcode && place.geometry?.location) {
            const geocoder = new window.google.maps.Geocoder();
            try {
              const response = await geocoder.geocode({ location: place.geometry.location });
              if (response.results && response.results.length > 0) {
                for (const result of response.results) {
                  const pc = result.address_components?.find((c: any) => c.types.includes("postal_code"))?.long_name;
                  if (pc) {
                    postcode = pc;
                    break;
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching postal code via reverse geocoding:", error);
            }
          }

          // Fallback 3: Try searching by address string as a last resort
          if (!postcode && place.formatted_address) {
            const geocoder = new window.google.maps.Geocoder();
            try {
              const response = await geocoder.geocode({ address: place.formatted_address });
              if (response.results && response.results.length > 0) {
                for (const result of response.results) {
                  const pc = result.address_components?.find((c: any) => c.types.includes("postal_code"))?.long_name;
                  if (pc) {
                    postcode = pc;
                    break;
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching postal code via address geocoding:", error);
            }
          }

          // Fallback 4: Try to extract from the original suggestion description text
          if (!postcode && suggestion.description) {
            const match = suggestion.description.match(/\b\d{4,5}\b/);
            if (match) postcode = match[0];
          }


          const locationInfo = {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
            placeId: place.place_id || "",
            formattedAddress: place.formatted_address || "",
            city: city,
            state: state,
            country: country
          }

          setFormData(prev => ({
            ...prev,
            name: areaName,
            address: place.formatted_address || "",
            postalCodes: postcode ? [postcode] : [],
            locationInfo
          }))

          setAddressInput(place.formatted_address || "")
          setShouldSearch(false)
          setShowDropdown(false)
          setSuggestions([])
        } else {
          toast.error("Failed to fetch location details")
        }
        setIsSearching(false)
      }
    )
  }

  const togglePlan = (id: string) => {
    setFormData(prev => {
      const planIds = prev.planIds || []
      if (planIds.includes(id)) {
        return { ...prev, planIds: planIds.filter(pId => pId !== id) }
      } else {
        return { ...prev, planIds: [...planIds, id] }
      }
    })
  }

  const handleSave = async () => {
    if (!formData.address || !formData.locationInfo) {
      toast.error("Please search and select a location from the dropdown")
      return
    }

    if (!formData.planIds || formData.planIds.length === 0) {
      toast.error("Please select at least one service plan")
      return
    }

    try {
      if (isEdit) {
        if (!id) return
        const result = await updateServiceArea({ id, data: formData }).unwrap()
        if (result.success) {
          toast.success(result.message || "Service area updated successfully")
          router.push("/dashboard/services-area")
        }
      } else {
        const result = await createServiceArea(formData as ICreateServiceAreaPayload).unwrap()
        if (result.success) {
          toast.success(result.message || "Service area created successfully")
          router.push("/dashboard/services-area")
        }
      }
    } catch (error: any) {
      // Priority: detailed message from API -> fallback generic message
      const errorMessage = error?.data?.message || error?.data?.errorMessages?.[0]?.message || `Failed to ${isEdit ? 'update' : 'create'} service area`;
      toast.error(errorMessage);
    }
  }

  if (isLoadingSingle) {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <FormSkeleton fields={4} />
      </div>
    )
  }

  return (
    <Container className="mx-auto pb-12">
      <div ref={mapAnchor} style={{ display: 'none' }} />
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/services-area" className="text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-[22px] font-medium text-[#1B253F] tracking-tight">
          {isEdit ? "Edit Services Area" : "Add New Service Area"}
        </h1>
      </div>

      <div className="bg-white border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-none p-8">
        <div className="space-y-8">
          {/* Google Places Location Search */}
          <div className="space-y-3 relative" ref={dropdownRef}>
            <label className="text-sm font-semibold text-[#1B253F]">Service location (Search Area/City)</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Type location (e.g. Badda, Dhaka)"
                value={addressInput}
                onChange={(e) => {
                  setAddressInput(e.target.value)
                  setShouldSearch(true)
                }}
                onFocus={() => shouldSearch && suggestions.length > 0 && setShowDropdown(true)}
                className="w-full pl-12 pr-12 py-3.5 bg-[#F9FAFB] border border-gray-100 outline-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#0265AF] rounded-none"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#0265AF]" />
                </div>
              )}
            </div>

            {/* Google Places Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute z-[100] left-0 right-0 top-[100%] mt-1 bg-white border border-gray-100 shadow-xl max-h-[300px] overflow-y-auto">
                {suggestions.map((place, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPlace(place)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-start gap-3 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#1B253F]">{place.description.split(',')[0]}</span>
                      <span className="text-xs text-gray-500 line-clamp-1">{place.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Area Info Card */}
          {formData.address && (
            <div className="p-6 bg-blue-50/40 border border-blue-100/60 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <p className="text-[10px] font-bold text-[#0265AF] uppercase tracking-widest mb-1.5">Area Identified</p>
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="text-base font-bold text-[#1B253F]">{formData.name}</p>
                </div>
                <p className="text-sm text-gray-500 pl-6 leading-tight">{formData.address}</p>
              </div>

              <div className="pl-6 pt-1">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1B253F] flex items-center gap-1">
                    Postal Code
                    <span className="text-[10px] text-gray-400 font-normal">(Verify or add manually if missing)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.postalCodes?.[0] || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCodes: [e.target.value] }))}
                    placeholder="e.g. 1700"
                    className="w-full max-w-[180px] px-3 py-2 bg-white border border-gray-200 outline-none text-sm placeholder:text-gray-300 focus:ring-1 focus:ring-[#0265AF] transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Service Plans Selection */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between mb-1">
              <label className="text-sm font-semibold text-[#1B253F]">Select service plans</label>
              <span className="text-[10px] uppercase font-bold text-gray-400">Total {plansData?.data?.length || 0} plans available</span>
            </div>

            {isLoadingPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-5 p-5 border border-gray-100 bg-white">
                    <Skeleton className="w-[64px] h-[64px] shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plansData?.data?.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => togglePlan(plan.id)}
                    className={cn(
                      "flex gap-5 p-5 border cursor-pointer transition-all duration-200 rounded-none relative overflow-hidden group",
                      formData.planIds?.includes(plan.id)
                        ? "border-[#0265AF] bg-blue-50/20 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    <div className="w-[64px] h-[64px] shrink-0 bg-[#F9FAFB] flex items-center justify-center rounded-sm overflow-hidden border border-gray-50">
                      {plan.image ? (
                        <img src={plan.image} alt={plan.category} className="w-full h-full object-cover" />
                      ) : (
                        <MapPin className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-[#1B253F]">
                          {plan.category.replace("_", " ")}
                        </h3>
                        <span className="text-lg font-bold text-[#0265AF]">${plan.price}</span>
                      </div>
                      <p className="text-xs text-[#0265AF] font-bold mb-2">{plan.dumpsterSize}</p>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {plan.extraInfo || "No additional information available."}
                      </p>
                    </div>

                    <div className="absolute top-0 right-0 p-1">
                      <div
                        className={cn(
                          "w-5 h-5 border-[1.5px] rounded-full flex items-center justify-center transition-colors shadow-sm",
                          formData.planIds?.includes(plan.id)
                            ? "bg-[#0265AF] border-[#0265AF]"
                            : "bg-white border-gray-200"
                        )}
                      >
                        {formData.planIds?.includes(plan.id) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
            <Link href="/dashboard/services-area">
              <Button
                variant="outline"
                className="px-8 py-3 h-auto rounded-none text-gray-600 border-gray-200"
              >
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white px-10 py-3.5 h-auto rounded-none font-semibold min-w-[200px]"
            >
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isEdit ? "Updating..." : "Saving..."}
                </>
              ) : isEdit ? "Update services area" : "Save new services area"}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

