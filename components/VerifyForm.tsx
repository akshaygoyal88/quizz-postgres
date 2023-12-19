"use client";
import React, { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import { useRouter } from "next/navigation";

interface VerifyFormProps {
  email: string;
  user: boolean;
}

export default function VerifyForm({ email, user }: VerifyFormProps) {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode })
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/signin?success=1");
      } else if (res.status === 404) {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form
              className="space-y-6"
              action="#"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div className="flex align-middle gap-4">
                <strong>Email:</strong>
                <p>{email}</p>
              </div>
              {user ? (
                <div>
                  <InputWithLabel
                    type="text"
                    name="code"
                    label="Verification Code"
                    id="code"
                    placeholder="****"
                    className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
                    defaultValue={undefined}
                    value={verificationCode}
                    onChange={handleVerificationCodeChange}
                    maxLength={4}
                    errors={error}
                  />

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ) : (
                <p>User not exists. Please try to register.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
