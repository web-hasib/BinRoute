"use client"

import React from "react"
import Container from "@/components/ui/container"
import DumpsterForm from "@/components/dashboard/dumpster/DumpsterForm"
import { useParams } from "next/navigation"
import { useGetServicePlanByIdQuery } from "@/redux/api/dumpster-plan/dumpsterPlanApi"
import { FormSkeleton } from "@/components/ui/FormSkeleton"

const EditDumpsterPage = () => {
  const params = useParams()
  const id = params?.id as string
  
  const { data: planData, isLoading, isError } = useGetServicePlanByIdQuery(id, {
    skip: !id
  })

  if (isLoading) {
    return (
      <Container className="py-10">
        <FormSkeleton fields={6} />
      </Container>
    )
  }

  if (isError || !planData?.data) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-red-500 font-bold">Failed to load dumpster details. Please try again.</p>
        </div>
      </Container>
    )
  }

  const plan = planData.data;

  // Map API data to Form format
  const initialData = {
    id: plan.id,
    title: plan.dumpsterSize,
    price: plan.price,
    category: plan.category?.toLowerCase()?.replace("_", "-"), // Mapping back to form enum
    capacity: plan.dumpsterCapacity || "", // Assuming this field might exist
    additionalInfo: plan.features || [],
    deliveryNote: plan.extraInfo || "",
    image: plan.image
  }

  return (
    <Container>
      <DumpsterForm mode="edit" initialData={initialData} />
    </Container>
  )
}

export default EditDumpsterPage
