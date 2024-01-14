"use client";

import { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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
      redirect: true,
      callbackUrl: "http://localhost:3000/signin"
    });

    if (result && !result.ok) {
      setError("Invalid credentials. Please try again.");
    }

    if (result && !result.error) {
      router.push("/");
      router.refresh();
    } else if (result) {
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
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
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
                errors={error.includes("User") ? error : ""}
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
                errors={error.includes("password") ? error : ""}
              />

              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
            <p className="mt-4 flex align-middle justify-center">
              Don't have an account?
              <Link href="/register" className="text-blue-700">
                Register
              </Link>
            </p>

            <div className="flex justify-center">
              <Link
                href="/reset-password"
                className="text-blue-500 font-semibold underline"
              >
                Forget password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
