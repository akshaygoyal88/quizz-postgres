"use client";

import React, { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { Button } from "./Button";

export default function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conPassword, setConPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [roleOfUser, setRoleOfUser] = useState<string>(UserRole.USER);

  const router = useRouter();

  const emailChangeHandler = (e: FormEvent) => {
    setEmail((e.target as HTMLInputElement).value);
  };

  const passwordChangeHandler = (e: FormEvent) => {
    setPassword((e.target as HTMLInputElement).value);
  };

  const conPasswordChangeHandler = (e: FormEvent) => {
    setConPassword((e.target as HTMLInputElement).value);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password === conPassword) {
      // const response = await fetch("/api/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: email,
      //     password: password,
      //     roleOfUser: roleOfUser,
      //   }),
      // });
      // console.log(response);
      // const data = await response.json();
      const {
        data: regRes,
        error: regError,
        isLoading: regIsLoading,
      } = await fetchData({
        url: `/api/register`,
        method: FetchMethodE.POST,
        body: {
          email: email,
          password: password,
          roleOfUser: roleOfUser,
        },
      });

      if (!regRes.error) {
        router.push(`/verify/${email}`);
        setError(regRes.error);
      } else {
        setError(regRes.error);
      }
    } else {
      setError("Password does not match.");
    }
  };
  return (
    <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
      <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Register
      </h2>
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
          otherText="(Password must be at least 8 characters.
                Include at least one lowercase letter.
                One uppercase letter, one number.
                One special character)."
        />
        <InputWithLabel
          type="password"
          name="conPassword"
          label="Confirm Password"
          id="conPassword"
          placeholder="*********"
          className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
          defaultValue={undefined}
          value={conPassword}
          onChange={conPasswordChangeHandler}
        />
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
      <p className="mt-4 flex align-middle justify-center text-md text-gray-700">
        Already have an account?
        <Link href="signin" className="text-blue-700 hover:underline">
          Sign In
        </Link>
      </p>
    </main>
  );
}
