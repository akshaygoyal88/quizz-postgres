"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@prisma/client";
import { Button } from "./Shared/Button";
import Heading from "./Shared/Heading";
import { handleRegisterForm } from "@/action/actionRegisterForm";
import Form, { FormInputs } from "./Shared/Form";
import LinksList from "./Shared/LinksList";

export default function RegisterForm() {
  return (
    <>
      <Heading headingText="Register" tag="h2" />
      <RegistrationForm />
      <LinksList
        linksList={[
          {
            description: "Already have an account?",
            href: "signin",
            link: "Sign In",
          },
        ]}
      />
    </>
  );
}

function RegistrationForm() {
  const [error, setError] = useState<string | null>(null);
  const [roleOfUser, setRoleOfUser] = useState<string>(UserRole.USER);

  const router = useRouter();

  const formAction = async (formData: FormData) => {
    formData.append("roleOfUser", roleOfUser);
    const res: { error?: string; userData?: User } = await handleRegisterForm(
      formData
    );
    if (!res?.error) {
      router.push(`/verify/${res?.userData?.email}`);
    } else {
      setError(res?.error);
    }
  };

  const inputList = [
    {
      type: "email",
      name: "email",
      label: "Email",
      id: "email",
      placeholder: "sample@mail.com",
      defaultValue: undefined,
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      id: "password",
      placeholder: "*********",
      defaultValue: undefined,
      otherText: `{(Password must be at least 8 characters.
        Include at least one lowercase letter.
        One uppercase letter, one number.
        One special character).}`,
    },
    {
      type: "password",
      name: "confirmPassword",
      label: "Confirm Password",
      id: "conPassword",
      placeholder: "*********",
      defaultValue: undefined,
    },
  ];
  return (
    <Form
      classes="mt-6 grid grid-cols-1 gap-y-8"
      action={formAction}
      button={[
        <Button
          type="submit"
          onClick={() => setRoleOfUser(UserRole.USER)}
          className="flex w-full "
        >
          Register as user
        </Button>,
        <Button
          type="submit"
          onClick={() => setRoleOfUser(UserRole.ADMIN)}
          className="flex w-full "
        >
          Register as admin
        </Button>,
      ]}
      error={error}
      gridClassesForBtn="grid gap-4 grid-cols-2 sm:grid-cols-2"
    >
      <FormInputs inputList={inputList} />
    </Form>
  );
}
