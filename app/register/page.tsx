import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Container, FormContainer } from "@/components/Container";

export default async function Register() {
  const session = await getServerSession();
  if (session) redirect("/");

  return (
    <Container>
      <FormContainer>
        <RegisterForm />
      </FormContainer>
    </Container>
  );
}
