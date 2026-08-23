import React from "react";
import Container from "@/components/ui/container";
import CustomerList from "@/components/dashboard/customers/CustomerList";

const CustomersPage = () => {
  return (
    <Container className="py-8 ">
      <CustomerList />
    </Container>
  );
};

export default CustomersPage;