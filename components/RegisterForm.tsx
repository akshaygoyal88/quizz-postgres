"use client";

import React, { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    if (error?.userEmail) delete error.userEmail;
    else if (error?.userExist) delete error.userExist;
    setEmail((e.target as HTMLInputElement).value);
  };

  const passwordChangeHandler = (e: FormEvent) => {
    if (error?.password) delete error.password;
    setPassword((e.target as HTMLInputElement).value);
  };

  const conPasswordChangeHandler = (e: FormEvent) => {
    if (error?.conPass) delete error.conPass;
    setConPassword((e.target as HTMLInputElement).value);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password === conPassword) {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          roleOfUser: "USER",
        }),
      });
      console.log(response);
      const data = await response.json();

      if (!data.error) {
        router.push(`/verify/${email}`);
        setError(data.error);
      } else if (data.error.userEmail) {
        setError({ ...error, userEmail: data.error.userEmail });
        return;
      } else if (data.error.password) {
        setError({ ...error, password: data.error.password });
        return;
      } else if (data.error.userExist) {
        setError({ ...error, userExist: data.error.userExist });
        return;
      } else {
        setError({ ...error, final: data.error.final });
      }
    } else {
      setError({ ...error, conPass: "Password does not match." });
    }
  };
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
            <p className="mt-4 flex align-middle justify-center">
              Already have an account?
              <Link href="signin" className="text-blue-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
