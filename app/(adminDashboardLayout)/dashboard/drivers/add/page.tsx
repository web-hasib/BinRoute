import React from "react";
import Container from "@/components/ui/container";
import DriverForm from "@/components/dashboard/drivers/DriverForm";

const AddDriverPage = () => {
    return (
        <Container className="py-8 bg-[#F8FAFC] min-h-screen">
            <DriverForm mode="add" />
        </Container>
    );
};

export default AddDriverPage;
