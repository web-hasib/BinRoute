import React from "react";
import Container from "@/components/ui/container";
import DriverList from "@/components/dashboard/drivers/DriverList";

const DriversPage = () => {
  return (
    <Container className="py-8 bg-[#F8FAFC] min-h-screen">
      <DriverList />
    </Container>
  );
};

export default DriversPage;