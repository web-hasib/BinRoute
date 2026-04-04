"use client";

import React from "react";
import Container from "@/components/ui/container";
import DriverProfile from "@/components/dashboard/drivers/DriverProfile";
import { useParams } from "next/navigation";

const DriverDetailsPage = () => {
    const { id } = useParams() as { id: string };
    
    return (
        <Container className="py-8 bg-[#F8FAFC] min-h-screen">
            <DriverProfile id={id} />
        </Container>
    );
};

export default DriverDetailsPage;
