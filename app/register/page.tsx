import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Container, FormContainer } from "@/components/Container";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function Register() {
  const userData = await getSessionUser();
  if (userData) redirect("/");
  return (
    <Container>
      <FormContainer>
        <RegisterForm />
      </FormContainer>
    </Container>
  );
}
