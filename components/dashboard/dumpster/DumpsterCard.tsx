"use client"

import React from "react"
import Image from "next/image"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DumpsterCardProps {
  id: string
  image: string
  title: string
  price: number
  capacity?: string
  additionalInfo?: string[]
  deliveryNote?: string
  onEdit?: (id: string) => void
}

const DumpsterCard = ({ 
  id, 
  image, 
  title, 
  price, 
  capacity, 
  additionalInfo, 
  deliveryNote = "Delivery fees may apply",
  onEdit 
}: DumpsterCardProps) => {
  return (
    <div className="bg-white border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
      {/* Dumpster Image */}
      <div className="w-full sm:w-[200px] h-[150px] bg-[#F8F9FA] flex items-center justify-center p-4 relative overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          width={160} 
          height={120} 
          className="object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#0A2540] mb-1">{title}</h3>
          <p className="text-sm text-gray-500">
            Price : <span className="text-[#0062AA] font-bold">Starting at <span className="text-xl">${price}</span></span>
          </p>
          
          {capacity && (
            <p className="text-sm text-[#4B5563] mt-2">
              Capacity: <span className="font-bold">{capacity}</span>
            </p>
          )}

          {additionalInfo && additionalInfo.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {additionalInfo.map((info, index) => (
                <p key={index} className="text-sm text-[#4B5563]">
                  {info}
                </p>
              ))}
            </div>
          )}
          
          <p className="text-sm text-[#4B5563] mt-1">{deliveryNote}</p>
        </div>

        <Link href={`/dashboard/dumpster/edit/${id}`}>
          <Button 
            variant="outline" 
            className="h-10 px-4 flex items-center gap-2 border border-[#0062AA] text-[#0062AA] font-bold hover:bg-[#0062AA] hover:text-white transition-all rounded-none mt-2"
          >
            <PencilIcon className="size-4" />
            Edit Details
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default DumpsterCard
