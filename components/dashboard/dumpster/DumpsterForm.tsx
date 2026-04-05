"use client"

import React, { useState } from "react"
import { ArrowLeft, Plus, Image as ImageIcon, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import SuccessModal from "@/components/ui/SuccessModal"
import { useRouter } from "next/navigation"

export interface DumpsterData {
  id?: string | number
  title?: string
  price?: string | number
  category?: string
  capacity?: string
  additionalInfo?: string[]
  deliveryNote?: string
  image?: string | null
}

interface DumpsterFormProps {
  initialData?: DumpsterData
  mode: "add" | "edit"
}

const sharedInputClasses = "w-full h-12 px-4 bg-[#d6d8da33] border-none text-sm focus:ring-1 focus:ring-[#0062AA] transition-all"

const DumpsterForm = ({ initialData, mode }: DumpsterFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    size: initialData?.title || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    capacity: initialData?.capacity || "",
    additionalInfo: initialData?.additionalInfo || [""],
    extraInfo: initialData?.deliveryNote || "",
    image: initialData?.image || null
  })

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleAddField = () => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, ""]
    }))
  }

  const handleRemoveField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter((_, i) => i !== index)
    }))
  }

  const handleInfoChange = (index: number, value: string) => {
    const newInfo = [...formData.additionalInfo]
    newInfo[index] = value
    setFormData(prev => ({ ...prev, additionalInfo: newInfo }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    console.log("Submitting formData:", formData)
    setIsSuccessModalOpen(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/dumpster" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="size-6 text-[#0A2540]" />
          </Link>
          <h1 className="text-2xl font-bold text-[#0A2540]">
            {mode === "add" ? "Add New Dumpster" : "Edit Dumpster Details"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {mode === "edit" && (
            <Button 
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-10 px-6 border-[#0062AA] text-[#0062AA] font-bold hover:bg-gray-50 rounded-none shadow-sm"
            >
                Cancel
            </Button>
          )}
          <Button 
            type="submit"
            className="h-10 px-8 bg-[#0062AA] hover:bg-[#004e89] text-white font-bold rounded-none shadow-md transition-all active:scale-[0.98]"
          >
            {mode === "add" ? "Add Dumpster" : "Save New Changes"}
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Dumpster Size */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-[#0A2540]">Dumpster Size</label>
            <input 
              type="text" 
              value={formData.size}
              onChange={(e) => setFormData(p => ({ ...p, size: e.target.value }))}
              placeholder="12 Yard Dumpster"
              className={sharedInputClasses}
            />
          </div>

          {/* Price Starting at */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Price Starting at</label>
            <input 
              type="text" 
              value={formData.price}
              onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
              placeholder="$120"
              className={sharedInputClasses}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
              className={`${sharedInputClasses} appearance-none cursor-pointer`}
            >
              <option value="">Select category</option>
              <option value="commercial">Commercial Service</option>
              <option value="roll-off">Roll off Service</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Dumpster Capacity</label>
            <input 
              type="text" 
              value={formData.capacity}
              onChange={(e) => setFormData(p => ({ ...p, capacity: e.target.value }))}
              placeholder="1 Ton"
              className={sharedInputClasses}
            />
          </div>

          {/* Additional Info Fields Dynamically */}
          {formData.additionalInfo.map((info, index) => (
            <div key={index} className="space-y-2 relative">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#0A2540]">Additional Information {index + 1}</label>
                    {formData.additionalInfo.length > 1 && (
                        <button type="button" onClick={() => handleRemoveField(index)} className="text-red-500 hover:text-red-700 p-1">
                            <X className="size-4" />
                        </button>
                    )}
                </div>
              <input 
                type="text" 
                value={info}
                onChange={(e) => handleInfoChange(index, e.target.value)}
                placeholder="60 large trash bags, or"
                className={sharedInputClasses}
              />
            </div>
          ))}
        </div>

        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddField}
          className="h-10 px-4 flex items-center gap-2 border border-[#0062AA] text-[#0062AA] font-bold hover:bg-[#EAF6FF] transition-all rounded-none"
        >
          <Plus className="size-4" />
          Add More Additional Information
        </Button>
      </div>

      {/* Photo Selection Card */}
      <div className="bg-red border border-gray-100 p-8 space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A2540]">Dumpster Photo</h3>
        <div className="w-full border-2 border-dashed border-blue-100 bg-[#d6d8da33] rounded-none py-16 flex flex-col items-center justify-center relative hover:border-[#0062AA]/30 transition-all cursor-pointer group">
          <ImageIcon className="size-12 text-[#64748B] mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-sm text-[#64748B] mb-1 font-medium">
            Drag & Drop your cover image here or <span className="text-[#0062AA] font-bold">Click to browse</span>
          </p>
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
        <p className="text-xs text-gray-400">Recommended size: 818 x 345px</p>
      </div>

      {/* Extra Information Card */}
      <div className="bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A2540]">Extra Information</h3>
        <input 
            type="text" 
            value={formData.extraInfo}
            onChange={(e) => setFormData(p => ({ ...p, extraInfo: e.target.value }))}
            placeholder="Delivery fees may apply"
            className={sharedInputClasses}
        />
      </div>

      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)}
        title={mode === "add" ? "Dumpster Added!" : "Changes Saved!"}
        message={`The dumpster details have been successfully ${mode === "add" ? "added" : "updated"}. It is now live in your service list.`}
        buttonText="Back to Dumpster List"
        onButtonClick={() => router.push("/dashboard/dumpster")}
      />
    </form>
  )
}

export default DumpsterForm
