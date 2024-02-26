"use client";
import React, { FormEvent, useState } from "react";
import InputWithLabel from "./Shared/InputWithLabel";
import { useRouter } from "next/navigation";

import { FetchMethodE, fetchData } from "@/utils/fetch";
import { handleSubmitVerifyForm } from "@/action/actionVerifyForm";
import { useFetch } from "@/hooks/useFetch";
import { signIn } from "next-auth/react";

interface VerifyFormProps {
  email: string;
  user: object;
}

export default function VerifyForm({ email, user }: VerifyFormProps) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  console.log(user);

  const formAction = async (formData: FormData) => {
    setError("");
    const res = await handleSubmitVerifyForm(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      const result = await signIn("credentials", {
        email,
        password: user.password,
        redirect: false,
      });
      if (result && !result.error) {
        router.push("/");
        router.refresh();
      }
    }
  };

  const handleVerification = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `/api/user/verifyCodeResend`,
      method: FetchMethodE.POST,
      body: user,
    });

    if (data && !data.error && !error) {
      setSuccess("Successfully resend verification code.");
      setTimeout(() => {
        setSuccess(null);
      }, 10000);
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
            {success && <p className="bg-green-500 p-2">{success}</p>}
            <form
              className="space-y-6"
              action={formAction}
              method="POST"
              // onSubmit={handleSubmit}
            >
              <div className="flex align-middle gap-4">
                <strong>Email:</strong>
                <p>{email}</p>
                <input type="hidden" name="email" value={email} />
              </div>
              {user ? (
                !user.isVerified ? (
                  <div>
                    <InputWithLabel
                      type="text"
                      name="verificationCode"
                      label="Verification Code"
                      id="verificationCode"
                      placeholder="****"
                      className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
                      defaultValue={undefined}
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
                  <div>Already Verified.</div>
                )
              ) : (
                <p>User not exists. Please try to register.</p>
              )}
            </form>
            {!user?.isVerified && (
              <button
                className="hover:underline text-blue-500 hover:text-blue-700 hover:underline"
                onClick={handleVerification}
              >
                Resend code
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
