import LoginForm from "@/components/LoginForm";
import React from "react";
import pathName from "@/constants";
import { Container, FormContainer } from "@/components/Container";

export default async function login() {
  // await authorization({ redirectTo: pathName.home.path });
  return (
    <Container>
      <FormContainer>
        <LoginForm />
      </FormContainer>
    </Container>
  );
}
