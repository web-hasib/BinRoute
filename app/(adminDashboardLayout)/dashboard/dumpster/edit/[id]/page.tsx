"use client"

import React from "react"
import Container from "@/components/ui/container"
import DumpsterForm from "@/components/dashboard/dumpster/DumpsterForm"
import { useParams } from "next/navigation"

const EditDumpsterPage = () => {
  const params = useParams()
  const dumpsterId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : undefined

  // Placeholder data for demonstration
  const initialData = {
    id: dumpsterId,
    title: "12 Yard Dumpster",
    price: 120,
    category: "roll-off",
    capacity: "1 Ton",
    additionalInfo: ["60 large trash bags, or", "4 pickup truck loads"],
    deliveryNote: "Delivery fees may apply",
    image: "/blog/hero_bg.png"
  }

  return (
    <Container>
      <DumpsterForm mode="edit" initialData={initialData} />
    </Container>
  )
}

export default EditDumpsterPage
