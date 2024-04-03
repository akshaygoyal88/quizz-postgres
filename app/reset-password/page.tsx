import { Container, FormContainer } from "@/components/Container";
import ResetPassword from "@/components/ResetPassword";
import React from "react";

const page = () => {
  return (
    <Container>
      <FormContainer>
        <ResetPassword />
      </FormContainer>
    </Container>
  );
};

export default page;
