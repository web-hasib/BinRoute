import React from "react"
import Container from "@/components/ui/container"
import DumpsterForm from "@/components/dashboard/dumpster/DumpsterForm"

const AddDumpsterPage = () => {
  return (
    <Container>
      <DumpsterForm mode="add" />
    </Container>
  )
}

export default AddDumpsterPage
