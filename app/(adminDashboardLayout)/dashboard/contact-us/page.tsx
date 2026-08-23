import React from "react";
import Container from "@/components/ui/container";
import ContactUsList from "@/components/dashboard/contact-us/ContactUsList";

const ContactUsPage = () => {
  return (
    <Container className="py-8 bg-transparent min-h-screen">
      <ContactUsList />
    </Container>
  );
};

export default ContactUsPage;