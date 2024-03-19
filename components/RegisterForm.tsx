"use client";

import React, { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, UserRole } from "@prisma/client";
import { Button } from "./Button";
import Heading from "./Shared/Heading";
import { handleRegisterForm } from "@/action/actionRegisterForm";

export default function RegisterForm() {
  return (
    <>
      <Heading headingText="Register" tag="h2" />
      <RegistrationForm />
      <span className="mt-4 flex align-middle justify-center text-md text-gray-700">
        Already have an account?
        <Link href="signin" className="text-blue-700 hover:underline">
          Sign In
        </Link>
      </span>
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
    <form
      className="mt-10 grid grid-cols-1 gap-y-8"
      action={formAction}
      method="POST"
    >
      <InputsForForm inputList={inputList} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-4">
        <Button
          type="submit"
          onClick={() => setRoleOfUser(UserRole.USER)}
          className="flex w-full "
        >
          Register as user
        </Button>

        <Button
          type="submit"
          onClick={() => setRoleOfUser(UserRole.ADMIN)}
          className="flex w-full "
        >
          Register as admin
        </Button>
      </div>
    </form>
  );
}

interface InputItem {
  type: string;
  name: string;
  label: string;
  id: string;
  placeholder: string;
  defaultValue?: string | undefined;
  otherText?: string | undefined;
}

const InputsForForm = ({ inputList }: { inputList: InputItem[] }) => {
  return (
    <>
      {inputList.map((inputContent, index) => (
        <InputWithLabel
          key={inputContent.id}
          type={inputContent.type}
          name={inputContent.name}
          label={inputContent.label}
          id={inputContent.id}
          placeholder={inputContent.placeholder}
          defaultValue={inputContent.defaultValue}
          otherText={inputContent.otherText}
          className="block w-full rounded-md border-0 p-1.5 pr-10 ring-1 ring-inset sm:text-sm sm:leading-6"
        />
      ))}
    </>
  );
};
