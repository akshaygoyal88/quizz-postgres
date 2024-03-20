import { Container, FormContainer } from "@/components/Container";
import { ChangePassword } from "@/components/ResetPassword";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";

const page = ({ params }: Params) => {
  return (
    <Container>
      <FormContainer>
        <ChangePassword userId={params.userId} token={params.resetToken} />
      </FormContainer>
    </Container>
  );
};

export default page;
