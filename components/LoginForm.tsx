"use client";

import { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "./Button";

export default function LoginForm({ className }: { className?: string }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();
  const [error, setError] = useState<string>("");

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
    if (error.includes("email")) setError("");
    setEmail((e.target as HTMLInputElement).value);
  };

  const passwordChangeHandler = (e: FormEvent) => {
    if (error.includes("password")) setError("");
    setPassword((e.target as HTMLInputElement).value);
  };
  return (
    <>
      {/* <div className="flex min-h-full flex-1 flex-col justify-center sm:px-6 lg:px-8"> */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <form
          className="mt-10 grid grid-cols-1 gap-y-8"
          action="#"
          method="POST"
          onSubmit={handleFormSubmit}
        >
          <InputWithLabel
            type="email"
            name="email"
            label="Email"
            id="email"
            placeholder="sample@mail.com"
            className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
            defaultValue={undefined}
            value={email}
            onChange={emailChangeHandler}
          />

          <InputWithLabel
            type="password"
            name="password"
            label="Password"
            id="password"
            placeholder="*********"
            className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
            defaultValue={undefined}
            value={password}
            onChange={passwordChangeHandler}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Sign in</Button>
        </form>
        <p className="mt-4 flex align-middle justify-center text-md text-gray-700">
          Don't have an account?
          <Link href="/register" className="text-blue-700 hover:underline">
            Register
          </Link>
        </p>

        <div className="flex justify-center">
          <Link
            href="/reset-password"
            className="text-blue-500 font-semibold hover:underline"
          >
            Forget password
          </Link>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
