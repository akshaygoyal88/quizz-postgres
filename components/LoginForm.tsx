"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "./Button";
import Heading from "./Shared/Heading";
import Form from "./Shared/Form";

export default function LoginForm({ className }: { className?: string }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
      label: "Email",
      id: "email",
      placeholder: "sample@mail.com",
      defaultValue: undefined,
      value: email,
      onChange: emailChangeHandler,
    },
    {
      type: "password",
      name: "password",
      label: "Password",
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
        classes="mt-10 grid grid-cols-1 gap-y-8"
        error={error}
        inputsForForm={inputList}
        onSubmit={handleFormSubmit}
        button={[
          <Button type="submit" className="flex w-full">
            Sign in
          </Button>,
        ]}
      />
      <AuthLinks />
    </>
  );
}

function AuthLinks() {
  return (
    <>
      <span className="mt-4 flex align-middle justify-center text-md text-gray-700">
        Don't have an account?
        <Link href="/register" className="text-blue-700 hover:underline">
          Register
        </Link>
      </span>
      <span className="flex justify-center">
        <Link
          href="/reset-password"
          className="text-blue-500 font-semibold hover:underline"
        >
          Forget password
        </Link>
      </span>
    </>
  );
}
