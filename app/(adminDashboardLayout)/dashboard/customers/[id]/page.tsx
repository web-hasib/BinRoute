"use client";

import React from "react";
import Container from "@/components/ui/container";
import CustomerProfile from "@/components/dashboard/customers/CustomerProfile";
import { useParams } from "next/navigation";

const CustomerDetailsPage = () => {
    const { id } = useParams() as { id: string };
    
    return (
        <Container className="">
            <CustomerProfile id={id} />
        </Container>
    );
};

export default CustomerDetailsPage;
