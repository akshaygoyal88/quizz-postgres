"use client";

import React, { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { FetchMethodE, fetchData } from "@/utils/fetch";

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
              <div className="flex">
                <div className="flex-1 mx-2">
                  <button
                    type="submit"
                    onClick={() => setRoleOfUser(UserRole.USER)}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Register as user
                  </button>
                </div>
                <div className="flex-1 mx-2">
                  <button
                    type="submit"
                    onClick={() => setRoleOfUser(UserRole.ADMIN)}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Register as admin
                  </button>
                </div>
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
