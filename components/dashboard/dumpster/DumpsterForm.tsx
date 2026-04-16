"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Plus, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import SuccessModal from "@/components/ui/SuccessModal"
import { useRouter } from "next/navigation"
import { useCreateServicePlanMutation, useUpdateServicePlanMutation } from "@/redux/api/dumpster-plan/dumpsterPlanApi"
import { toast } from "sonner"

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
  const [createServicePlan, { isLoading: isCreating }] = useCreateServicePlanMutation()
  const [updateServicePlan, { isLoading: isUpdating }] = useUpdateServicePlanMutation()
  const isSubmitting = React.useRef(false) // Hard lock for submission
  
  const [formData, setFormData] = useState({
    size: initialData?.title || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    capacity: initialData?.capacity || "",
    additionalInfo: initialData?.additionalInfo || [""],
    extraInfo: initialData?.deliveryNote || "",
    image: initialData?.image || null
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  // Update form if initialData changes (important for edit mode after fetch)
  useEffect(() => {
    if (initialData) {
      setFormData({
        size: initialData.title || "",
        price: initialData.price || "",
        category: initialData.category || "",
        capacity: initialData.capacity || "",
        additionalInfo: initialData.additionalInfo || [""],
        extraInfo: initialData.deliveryNote || "",
        image: initialData.image || null
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event from bubbling up

    if (isSubmitting.current || isCreating || isUpdating) return; 
    
    isSubmitting.current = true; // Lock it

    if (!selectedFile && !imagePreview && mode === "add") {
      toast.error("Please select a dumpster image")
      isSubmitting.current = false;
      return
    }

    if (!formData.category) {
      toast.error("Please select a category")
      isSubmitting.current = false;
      return
    }

    const payload = {
      dumpsterSize: formData.size,
      category: formData.category.toUpperCase().replace("-", "_"),
      price: Number(formData.price.toString().replace("$", "")),
      features: formData.additionalInfo.filter(f => f.trim() !== ""),
      extraInfo: formData.extraInfo
    }

    const submitData = new FormData()
    if (selectedFile) {
      submitData.append("image", selectedFile)
    }
    submitData.append("data", JSON.stringify(payload))

    try {
      let res;
      if (mode === "add") {
        res = await createServicePlan(submitData).unwrap()
      } else {
        res = await updateServicePlan({ id: initialData?.id as string, formData: submitData }).unwrap()
      }

      if (res.success) {
        setIsSuccessModalOpen(true)
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong")
      isSubmitting.current = false;
    }
  }

  const isPending = isCreating || isUpdating;

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
            disabled={isCreating}
            className="h-10 px-8 bg-[#0062AA] hover:bg-[#004e89] text-white font-bold rounded-none shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isCreating ? "Saving..." : (mode === "add" ? "Add Dumpster" : "Save New Changes")}
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
              required
              type="text" 
              value={formData.size}
              onChange={(e) => setFormData(p => ({ ...p, size: e.target.value }))}
              placeholder="e.g. 4 Yard"
              className={sharedInputClasses}
            />
          </div>

          {/* Price Starting at */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Price Starting at ($)</label>
            <input 
              required
              type="number" 
              value={formData.price}
              onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
              placeholder="250"
              className={sharedInputClasses}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0A2540]">Category</label>
            <select 
              required
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
            <label className="text-sm font-bold text-[#0A2540]">Dumpster Capacity (Optional)</label>
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
                    <label className="text-sm font-bold text-[#0A2540]">Feature {index + 1}</label>
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
                placeholder="Weekly pickup, Recycling support, etc."
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
          Add More Features
        </Button>
      </div>

      {/* Photo Selection Card */}
      <div className="bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A2540]">Dumpster Photo</h3>
        <div className="w-full border-2 border-dashed border-blue-100 bg-[#d6d8da33] rounded-none py-10 flex flex-col items-center justify-center relative hover:border-[#0062AA]/30 transition-all cursor-pointer group">
          {imagePreview ? (
            <div className="relative w-40 h-32">
              <Image src={imagePreview} alt="Preview" fill className="object-contain" />
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); setImagePreview(null); setSelectedFile(null); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="size-12 text-[#64748B] mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-sm text-[#64748B] mb-1 font-medium">
                Drag & Drop or <span className="text-[#0062AA] font-bold">Click to browse</span>
              </p>
            </>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>
        <p className="text-xs text-gray-400 text-center">Recommended size: 818 x 345px</p>
      </div>

      {/* Extra Information Card */}
      <div className="bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A2540]">Extra Information</h3>
        <input 
            type="text" 
            value={formData.extraInfo}
            onChange={(e) => setFormData(p => ({ ...p, extraInfo: e.target.value }))}
            placeholder="e.g. Best for small commercial spaces."
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
