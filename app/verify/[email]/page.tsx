import VerifyForm from "@/components/VerifyForm";
import { redirect } from "next/navigation";
import React from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getSessionUser } from "@/utils/getSessionUser";
import { getUserByEmail } from "@/services/user";
import { Container, FormContainer } from "@/components/Container";

export default async function Verify({ params }: Params) {
  const userData = await getSessionUser();
  if (userData) {
    redirect("/profile");
  }
  const decodedEmail = decodeURIComponent(params.email);

  const userExist = await getUserByEmail(decodedEmail);
  if (userExist) {
    return (
      <Container>
        <FormContainer>
          <VerifyForm email={decodedEmail} user={userExist} />
        </FormContainer>
      </Container>
    );
  } else {
    return <>ERROR COMPONENT</>;
  }
}
