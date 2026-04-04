"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Container from '@/components/ui/container'
import { ArrowLeft } from 'lucide-react'
import { DetailCard } from '@/components/booking/details/DetailCard'
import { DetailRow } from '@/components/booking/details/DetailRow'
import { StatusBadge } from '@/components/booking/details/StatusBadge'

const BookingDetailsPage = () => {
    const { id } = useParams()
    const router = useRouter()

    const mockData = {
        customer: {
            name: "John Doe",
            email: "[EMAIL_ADDRESS]",
            company: "The Walt Disney Company",
            phone: "+(555) 123-4567"
        },
        service: {
            name: "Roll off Service",
            distance: "42 miles from dispatch center"
        },
        delivery: {
            instructions: "Please place the dumpster on the left side of the driveway, away from the power lines."
        },
        schedule: {
            dropUpDate: "Nov 15, 2023",
            wasteDropUpDate: "Nov 22, 2023"
        },
        financial: {
            basePrice: "$650.00",
            surcharge: "$100.00",
            total: "$750.00",
            status: "Paid"
        }
    }

    return (
        <Container className="bg-[#F6F6F6] min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => router.back()}
                  className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
                </button>
                <h1 className="text-2xl font-bold text-[#001D3D] flex items-center gap-3">
                    Booking Details #INV-{id || "88321"}
                    <StatusBadge status="Complete" type="green" className="font-normal" />
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Customer Information & Map View (Box 1) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-none border border-gray-100 shadow-sm overflow-hidden">
                        <div className=" m-4">

                        <div className=" py-5 border-b border-gray-100 bg-white">
                            <h3 className="text-[20px] font-semibold text-[#515050]">Customer Information</h3>
                        </div>

                        <div className="p-0 border border-gray-100">
                            <DetailRow label="Name" value={mockData.customer.name} />
                            <DetailRow label="Email Address" value={mockData.customer.email} />
                            <DetailRow label="Company Name" value={mockData.customer.company} />
                            <DetailRow label="Phone Number" value={mockData.customer.phone} isLast />
                        </div>
                        </div>
                        
                        <div className="px-6 py-5  border-gray-100  mt-4">
                            <h3 className="text-[20px] font-semibold text-[#515050]">Map view</h3>
                        </div>
                        <div className="p-6 h-[400px] flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 m-6 mb-8 text-[#666666] font-medium">
                            map will be here
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Box 2: Service Information & Delivery Instructions */}
                    <div className="bg-white rounded-none border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-white">
                            <h3 className="text-[20px] font-semibold text-[#515050]">Service Information</h3>
                        </div>
                        <DetailRow label="Service Name" value={mockData.service.name} />
                        <DetailRow label="Calculated Distance" value={mockData.service.distance} isLast />
                        
                        <div className="px-6 py-5 border-y border-gray-100 bg-white mt-1">
                            <h3 className="text-[20px] font-semibold text-[#515050]">Delivery Instructions</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-[#71717A] leading-relaxed italic border border-gray-100 p-4 rounded-none bg-gray-50">
                                &quot;{mockData.delivery.instructions}&quot;
                            </p>
                        </div>
                    </div>

                    {/* Box 3: Schedule Details */}
                    <DetailCard title="Schedule Details">
                        <DetailRow label="Dumpster Drop up date" value={mockData.schedule.dropUpDate} />
                        <DetailRow label="Waste Drop up date" value={mockData.schedule.wasteDropUpDate} isLast />
                    </DetailCard>

                    {/* Box 4: Financial Summary */}
                    <DetailCard 
                        title="Financial Summary" 
                        headerAction={<StatusBadge status={mockData.financial.status} type="green" />}
                    >
                        <DetailRow label="Base Price" value={mockData.financial.basePrice} />
                        <DetailRow label="Distance Surcharge" value={mockData.financial.surcharge} />
                        <DetailRow 
                            label="Total Amount" 
                            value={mockData.financial.total} 
                            isLast 
                            className="bg-gray-50/50" 
                            valueClassName="text-lg font-bold"
                        />
                    </DetailCard>
                </div>
            </div>
        </Container>
    )
}

export default BookingDetailsPage