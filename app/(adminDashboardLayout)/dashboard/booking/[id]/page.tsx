"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Container from '@/components/ui/container'
import { ArrowLeft } from 'lucide-react'
import { DetailCard } from '@/components/booking/details/DetailCard'
import { DetailRow } from '@/components/booking/details/DetailRow'
import { StatusBadge } from '@/components/booking/details/StatusBadge'
import { Button } from '@/components/ui/button'

import { useGetBookingByIdQuery } from '@/redux/api/adminDashboard/bookingApi'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES: ("places")[] = ["places"];

const BookingDetailsPage = () => {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    
    const { data: bookingData, isLoading } = useGetBookingByIdQuery(id)
    const booking = bookingData?.data

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
        libraries: LIBRARIES
    });

    const [directionsResponse, setDirectionsResponse] = React.useState<google.maps.DirectionsResult | null>(null);

    const officeLocation = React.useMemo(() => ({
        lat: Number(process.env.NEXT_PUBLIC_OFFICE_LATITUDE),
        lng: Number(process.env.NEXT_PUBLIC_OFFICE_LONGITUDE)
    }), []);

    React.useEffect(() => {
        if (!isLoaded || !booking?.dropoffLatitude || !booking?.dropoffLongitude) return;

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: officeLocation,
                destination: { lat: booking.dropoffLatitude, lng: booking.dropoffLongitude },
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK && result) {
                    setDirectionsResponse(result);
                } else {
                    console.error(`Error fetching directions ${result}`);
                }
            }
        );
    }, [isLoaded, booking?.dropoffLatitude, booking?.dropoffLongitude, officeLocation]);

    if (isLoading) {
        return (
            <Container className="bg-[#F6F6F6] min-h-screen">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-64 bg-gray-200" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[600px] bg-gray-200" />
                        <div className="space-y-6">
                            <div className="h-64 bg-gray-200" />
                            <div className="h-48 bg-gray-200" />
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    if (!booking) {
        return (
            <Container className="bg-[#F6F6F6] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-500">Booking not found</h2>
                    <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
                </div>
            </Container>
        )
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
                    Booking Details #{booking.id.slice(-6).toUpperCase()}
                    <StatusBadge 
                        status={booking.status} 
                        type={booking.status === "ACTIVE" ? "green" : "red"} 
                        className="font-normal" 
                    />
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
                            <DetailRow label="Name" value={booking.user?.fullName || booking.firstName + " " + booking.lastName} />
                            <DetailRow label="Email Address" value={booking.email} />
                            <DetailRow label="Company Name" value={booking.companyName || "N/A"} />
                            <DetailRow label="Phone Number" value={booking.phone} isLast />
                        </div>
                        </div>
                        
                        <div className="px-6 py-5  border-gray-100  mt-4">
                            <h3 className="text-[20px] font-semibold text-[#515050]">Map view</h3>
                        </div>
                        <div className="p-0 h-[400px] flex items-center justify-center bg-gray-50 border border-gray-100 m-6 mb-8 text-[#666666] font-medium overflow-hidden">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: "100%", height: "100%" }}
                                    center={officeLocation}
                                    zoom={12}
                                    options={{
                                        disableDefaultUI: true,
                                        zoomControl: false,
                                    }}
                                >
                                    {directionsResponse && (
                                        <DirectionsRenderer
                                            directions={directionsResponse}
                                            options={{
                                                suppressMarkers: false,
                                                polylineOptions: {
                                                    strokeColor: "#0265AF",
                                                    strokeWeight: 4,
                                                }
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-full w-full" />
                                    <span className="text-xs text-gray-400 italic">Initializing map canvas...</span>
                                </div>
                            )}
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
                        <DetailRow label="Service Name" value={booking.plan?.category.replace("_", " ") + " - " + booking.plan?.dumpsterSize} />
                        <DetailRow label="Waste Type" value={booking.wasteType} />
                        <DetailRow label="Container Count" value={booking.containerCount.toString()} isLast />
                        
                        <div className="px-6 py-5 border-y border-gray-100 bg-white mt-1">
                            <h3 className="text-[20px] font-semibold text-[#515050]">Delivery Instructions</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-[#71717A] leading-relaxed italic border border-gray-100 p-4 rounded-none bg-gray-50">
                                &quot;{booking.deliveryInstructions || "No instructions provided"}&quot;
                            </p>
                        </div>
                    </div>

                    {/* Box 3: Schedule Details */}
                    <DetailCard title="Schedule Details">
                        <DetailRow label="Dumpster Drop up date" value={format(new Date(booking.dropoffDate), "MMM dd, yyyy")} />
                        <DetailRow label="Waste Pickup date" value={booking.pickupDate ? format(new Date(booking.pickupDate), "MMM dd, yyyy") : "N/A"} isLast />
                    </DetailCard>

                    {/* Box 4: Financial Summary */}
                    <DetailCard 
                        title="Financial Summary" 
                        headerAction={<StatusBadge status={booking.status === "ACTIVE" ? "Paid" : "Pending"} type={booking.status === "ACTIVE" ? "green" : "red"} />}
                    >
                        <DetailRow label="Base Price" value={`$${booking.totalAmount - booking.serviceAreaFee}`} />
                        <DetailRow label="Service Area Fee" value={`$${booking.serviceAreaFee}`} />
                        <DetailRow 
                            label="Total Amount" 
                            value={`$${booking.totalAmount}`} 
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