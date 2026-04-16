"use client";

import React, { use } from 'react'
import { ServiceAreaForm } from '@/components/dashboard/services-area/ServiceAreaForm'
import Container from "@/components/ui/container"

export default function EditServiceAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Container>
      <ServiceAreaForm mode="edit" id={id} />
    </Container>
  )
}
