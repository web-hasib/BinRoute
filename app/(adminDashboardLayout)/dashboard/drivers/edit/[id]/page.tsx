"use client";

import React from "react";
import Container from "@/components/ui/container";
import DriverForm from "@/components/dashboard/drivers/DriverForm";
import { useParams } from "next/navigation";

const EditDriverPage = () => {
    const { id } = useParams() as { id: string };

    return (
        <Container className="py-8 bg-[#F8FAFC] min-h-screen">
            <DriverForm mode="edit" id={id} />
        </Container>
    );
};

export default EditDriverPage;
