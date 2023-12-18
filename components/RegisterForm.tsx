"use client";

import React, { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import { useRouter } from "next/navigation";

function generateUniqueAlphanumericToken(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const tokenLength = length || 4;
  const tokens: Set<string> = new Set();

  while (true) {
    let newToken = "";

    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newToken += characters.charAt(randomIndex);
    }

    if (!tokens.has(newToken)) {
      tokens.add(newToken);
      return newToken;
    }
  }
}

export default function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conPassword, setConPassword] = useState<string>("");
  const [error, setError] = useState<{
    userEmail?: string;
    password?: string;
    userExist?: string;
    conPass?: string;
    final?: string;
  } | null>(null);

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
      const token = generateUniqueAlphanumericToken(4);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          token: token,
        }),
      });
      console.log(response);
      const data = await response.json();

      if (!data.error) {
        // router.push("/verify");
        setError(data.error);
      } else if (data.error.userEmail) {
        setError({ ...error, password: data.error.userEmail });
        setTimeout(() => setError(null), 10000);
        return;
      } else if (data.error.password) {
        setError({ ...error, password: data.error.password });
        setTimeout(() => setError(null), 30000);
        return;
      } else if (data.error.userExist) {
        console.log(data.error.userExist);
        setError({ ...error, userExist: data.error.userExist });
        setTimeout(() => setError(null), 10000);
        return;
      } else {
        setError({ ...error, final: data.error.final });
      }
    } else {
      setError({ conPass: "Password does not match." });
      setTimeout(() => setError(null), 10000);
    }
  };
  console.log(error);
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form
              className="space-y-6"
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
                errors={error?.userExist || error?.userEmail}
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
                errors={error?.password}
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
                errors={error?.conPass}
              />
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
