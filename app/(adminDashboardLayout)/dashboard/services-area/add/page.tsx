import React from 'react'
import { ServiceAreaForm } from '@/components/dashboard/services-area/ServiceAreaForm'
import Container from "@/components/ui/container"

export default function AddServiceAreaPage() {
  return (
    <Container>
      <ServiceAreaForm mode="add" />
    </Container>
  )
}
