"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "./Shared/Button";
import Heading from "./Shared/Heading";
import Form, { FormInputs } from "./Shared/Form";
import LinksList from "./Shared/LinksList";

export default function LoginForm({ className }: { className?: string }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("*Fill required fields");
      return;
    }

    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      // callbackUrl: "http://localhost:3000/signin"
    });
    if (result && !result.ok) {
      setError("Invalid credentials. Please try again.");
    }

    if (result && !result.error) {
      router.push("/");
      router.refresh();
    } else if (result?.error) {
      if (result.error.includes("User not verified.")) {
        router.push(`/verify/${email}`);
      }
      setError(`${result.error}`);
    }
  };

  const emailChangeHandler = (e: FormEvent) => {
    if (error?.includes("email")) setError("");
    setEmail((e.target as HTMLInputElement).value);
  };

  const passwordChangeHandler = (e: FormEvent) => {
    if (error?.includes("password")) setError("");
    setPassword((e.target as HTMLInputElement).value);
  };

  const inputList = [
    {
      type: "email",
      name: "email",
      label: "Email*",
      id: "email",
      placeholder: "sample@mail.com",
      defaultValue: undefined,
      value: email,
      onChange: emailChangeHandler,
    },
    {
      type: "password",
      name: "password",
      label: "Password*",
      id: "password",
      placeholder: "*********",
      defaultValue: undefined,
      value: password,
      onChange: passwordChangeHandler,
    },
  ];

  return (
    <>
      <Heading headingText="Sign in to your account" tag="h2" />
      <Form
        action={() => {}}
        classes="mt-10 grid grid-cols-1 gap-y-8"
        error={error}
        onSubmit={handleFormSubmit}
        button={[
          <Button type="submit" className="flex w-full">
            Sign in
          </Button>,
        ]}
      >
        <FormInputs inputList={inputList} />
        {error && error.includes("verify") && (
          <Link
            className="text-blue-600 px-2 text-sm hover:underline"
            href={`verify/${email}`}
          >
            Click to verify
          </Link>
        )}
      </Form>

      <LinksList
        linksList={[
          {
            description: " Don't have an account?",
            href: "/register",
            link: "Register",
          },
          {
            href: "/reset-password",
            link: "Forget password",
          },
        ]}
      />
    </>
  );
}
