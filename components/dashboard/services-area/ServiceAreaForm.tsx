"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, Hammer, MapPin, Check, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface ServiceAreaFormData {
  id?: string
  location?: string
  services?: {
    commercial: boolean
    rolloff: boolean
  }
}

interface ServiceAreaFormProps {
  mode: "add" | "edit"
  initialData?: ServiceAreaFormData
}

export const ServiceAreaForm = ({ mode, initialData }: ServiceAreaFormProps) => {
  const router = useRouter()
  const isEdit = mode === "edit"

  const [location, setLocation] = useState(initialData?.location || "")
  const [services, setServices] = useState<{ commercial: boolean; rolloff: boolean }>({
    commercial: initialData?.services?.commercial || false,
    rolloff: initialData?.services?.rolloff || false,
  })

  return (
    <div className="">
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
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#1B253F]">Service location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Write Full Address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-gray-100 outline-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#0265AF] rounded-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-[#1B253F]">Select service</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Commercial Service Card */}
              <div
                onClick={() => setServices(prev => ({ ...prev, commercial: !prev.commercial }))}
                className="flex gap-5 p-5 border border-gray-100 bg-white cursor-pointer hover:border-gray-200 transition-colors rounded-none"
              >
                <div className="w-[60px] h-[60px] shrink-0 bg-[#F9FAFB] flex items-center justify-center rounded-sm">
                  <Building2 className="w-8 h-8 text-[#1B253F]" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-base font-semibold text-[#1B253F] mb-1.5 flex items-center gap-2">
                    Commercial Service
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed pr-2">
                    Robust disposal for renovations and job sites, managing concrete, wood, and metal.
                  </p>
                </div>
                <div className="shrink-0 flex items-center pt-2">
                  <div
                    className={cn(
                      "w-[18px] h-[18px] border-[1.5px] rounded flex items-center justify-center transition-colors",
                      services.commercial ? "bg-[#0265AF] border-[#0265AF]" : "border-gray-300"
                    )}
                  >
                    {services.commercial && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                </div>
              </div>

              {/* Roll Off Dumpster Service Card */}
              <div
                onClick={() => setServices(prev => ({ ...prev, rolloff: !prev.rolloff }))}
                className="flex gap-5 p-5 border border-gray-100 bg-white cursor-pointer hover:border-gray-200 transition-colors rounded-none"
              >
                <div className="w-[60px] h-[60px] shrink-0 bg-[#F9FAFB] flex items-center justify-center rounded-sm">
                  <Hammer className="w-8 h-8 text-[#1B253F]" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-base font-semibold text-[#1B253F] mb-1.5 flex items-center gap-2">
                    Roll of Dumpster Service
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed pr-2">
                    Title description field is robust disposal for renovations and job sites, managing concrete, wood, and metal.
                  </p>
                </div>
                <div className="shrink-0 flex items-center pt-2">
                  <div
                    className={cn(
                      "w-[18px] h-[18px] border-[1.5px] rounded flex items-center justify-center transition-colors",
                      services.rolloff ? "bg-[#0265AF] border-[#0265AF]" : "border-gray-300"
                    )}
                  >
                    {services.rolloff && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100/0">
            {isEdit ? (
              <>
                <Button
                  variant="outline"
                  className="text-[#0265AF] border-[#0265AF] hover:bg-blue-50 px-5 py-2.5 h-auto rounded-none flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit Services Area
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50 px-5 py-2.5 h-auto rounded-none flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete Services Area
                </Button>
              </>
            ) : (
              <Button
                className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white px-8 py-2.5 h-auto rounded-none"
              >
                Save new services area
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
