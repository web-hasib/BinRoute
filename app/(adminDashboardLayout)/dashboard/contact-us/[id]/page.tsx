"use client";

import React from "react";
import Container from "@/components/ui/container";
import ContactUsDetails from "@/components/dashboard/contact-us/ContactUsDetails";
import { useParams } from "next/navigation";

const ContactMessageDetailsPage = () => {
    const { id } = useParams() as { id: string };
    
    return (
        <Container className="py-8 bg-transparent min-h-screen">
            <ContactUsDetails id={id} />
        </Container>
    );
};

export default ContactMessageDetailsPage;
