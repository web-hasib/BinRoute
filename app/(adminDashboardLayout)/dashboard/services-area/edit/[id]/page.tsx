import React from 'react'
import { ServiceAreaForm } from '@/components/dashboard/services-area/ServiceAreaForm'
import Container from "@/components/ui/container"

// Optional: You could fetch the data for the specific id here or inside the component
export default function EditServiceAreaPage({ params }: { params: { id: string } }) {
  // Mock data for the demonstration
  const initialData = {
    location: "6391 Elgin St. Celina, Delaware 10299",
    services: {
      commercial: true,
      rolloff: true
    }
  }

  return (
    <Container>
      <ServiceAreaForm mode="edit" initialData={initialData} />
    </Container>
  )
}
