"use client";
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Loader2, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  useCreateServiceAreaMutation, 
  useGetServicePlansQuery, 
  useGetServiceAreaByIdQuery, 
  useUpdateServiceAreaMutation 
} from "@/redux/api/service-area/serviceAreaApi"
import { toast } from "sonner"
import { ICreateServiceAreaPayload } from "@/types/global"

interface ServiceAreaFormProps {
  mode: "add" | "edit"
  id?: string
}

interface NominatimAddress {
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

interface NominatimPlace {
  lat: string;
  lon: string;
  osm_id: number;
  display_name: string;
  address: NominatimAddress;
}

export const ServiceAreaForm = ({ mode, id }: ServiceAreaFormProps) => {
  const router = useRouter()
  const isEdit = mode === "edit"

  const { data: plansData, isLoading: isLoadingPlans } = useGetServicePlansQuery()
  const [createServiceArea, { isLoading: isCreating }] = useCreateServiceAreaMutation()
  const [updateServiceArea, { isLoading: isUpdating }] = useUpdateServiceAreaMutation()

  // Fetch existing data if in Edit mode
  const { data: singleAreaData, isLoading: isLoadingSingle } = useGetServiceAreaByIdQuery(id as string, {
    skip: !isEdit || !id,
  })

  // Nominatim Search States
  const [addressInput, setAddressInput] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    }
  }, [isEdit, singleAreaData, setAddressInput]);

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

  // Nominatim Search Logic (Debounced)
  useEffect(() => {
    if (addressInput.length < 3) {
      setSuggestions([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(addressInput)}`
        )
        const data = await response.json()
        setSuggestions(data.slice(0, 5))
        setShowDropdown(true)
      } catch (error) {
        console.error("Geocoding error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 600)

    return () => clearTimeout(delayDebounce)
  }, [addressInput])

  const handleSelectPlace = (place: NominatimPlace) => {
    const addr = place.address
    const locationInfo = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      placeId: place.osm_id.toString(),
      formattedAddress: place.display_name,
      city: addr.city || addr.town || addr.village || addr.suburb || "",
      state: addr.state || "",
      country: addr.country || ""
    }

    const areaName = addr.suburb || addr.neighbourhood || addr.city || addr.town || "Service Area"

    setFormData(prev => ({
      ...prev,
      name: areaName,
      address: place.display_name,
      postalCodes: addr.postcode ? [addr.postcode] : [],
      locationInfo
    }))

    setAddressInput(place.display_name)
    setShowDropdown(false)
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
      <div className="flex items-center justify-center p-20 min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0265AF]" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
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
          {/* Free Location Search (OpenStreetMap) */}
          <div className="space-y-3 relative" ref={dropdownRef}>
            <label className="text-sm font-semibold text-[#1B253F]">Service location (Search Area/City)</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Type location (e.g. Badda, Dhaka)"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                className="w-full pl-12 pr-12 py-3.5 bg-[#F9FAFB] border border-gray-100 outline-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#0265AF] rounded-none"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#0265AF]" />
                </div>
              )}
            </div>

            {/* Nominatim Suggestions Dropdown */}
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
                      <span className="text-sm font-semibold text-[#1B253F]">{place.display_name.split(',')[0]}</span>
                      <span className="text-xs text-gray-500 line-clamp-1">{place.display_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Area Info Card */}
          {formData.name && (
            <div className="p-5 bg-blue-50/30 border border-blue-100/50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-bold text-[#0265AF] uppercase tracking-widest mb-1">Area Identified</p>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <p className="text-base font-bold text-[#1B253F]">{formData.name}</p>
              </div>
              <p className="text-sm text-gray-500 pl-6">{formData.address}</p>
              {formData.postalCodes && formData.postalCodes.length > 0 && (
                <p className="text-xs text-gray-400 pl-6 mt-1">Postal Code: {formData.postalCodes[0]}</p>
              )}
            </div>
          )}

          {/* Service Plans Selection */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between mb-1">
              <label className="text-sm font-semibold text-[#1B253F]">Select service plans</label>
              <span className="text-[10px] uppercase font-bold text-gray-400">Total {plansData?.data?.length || 0} plans available</span>
            </div>
            
            {isLoadingPlans ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching available plans...
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
    </div>
  )
}

