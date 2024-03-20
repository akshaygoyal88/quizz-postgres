"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { handleSubmitVerifyForm } from "@/action/actionVerifyForm";
import { signIn } from "next-auth/react";
import { User } from "@prisma/client";
import Heading from "./Shared/Heading";
import Form from "./Shared/Form";
import { Button } from "./Button";

interface VerifyFormProps {
  email: string;
  user?: User;
}

export default function VerifyForm({ email, user }: VerifyFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const formAction = async (formData: FormData) => {
    setError(null);
    const res = await handleSubmitVerifyForm(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      const result = await signIn("credentials", {
        email,
        password: user?.password,
        redirect: false,
      });
      if (result && !result.error) {
        router.push("/");
        router.refresh();
      }
    }
  };

  const handleResendVerificationCode = async () => {
    const { data, error, isLoading } = await fetchData({
      url: `/api/user/verifyCodeResend`,
      method: FetchMethodE.POST,
      body: user,
    });

    if (data && !data.error && !error) {
      setSuccess(
        "Successfully resend verification code. Please check your email."
      );
      setTimeout(() => {
        setSuccess(null);
      }, 10000);
    }
  };

  return (
    <>
      <Heading headingText="Verify your account" tag="h2" />
      {!user?.isVerified ? (
        <>
          <Form
            classes="space-y-6 mt-8"
            error={error}
            success={success}
            inputsForForm={[
              {
                type: "text",
                name: "verificationCode",
                label: "Verification Code",
                id: "verificationCode",
                placeholder: "****",
                defaultValue: undefined,
                maxLength: 4,
                onChange: () => setError(null),
              },
            ]}
            action={formAction}
            button={[
              <Button type="submit" className="flex w-full">
                Verify
              </Button>,
            ]}
            otherInputs={[
              <div className="flex align-middle gap-4">
                <strong>Email:</strong>
                <p>{email}</p>
                <input type="hidden" name="email" value={email} />
              </div>,
            ]}
          />
          {user && (
            <ResendLink
              user={user}
              handleResendVerificationCode={handleResendVerificationCode}
            />
          )}
        </>
      ) : (
        <span className="w-full flex flex-col items-center mt-10">
          Already Verified.
        </span>
      )}
    </>
  );
}

const ResendLink = ({
  user,
  handleResendVerificationCode,
}: {
  user: User;
  handleResendVerificationCode: () => void;
}) => {
  return (
    <>
      {!user?.isVerified && (
        <button
          className="hover:underline text-blue-500 hover:text-blue-700"
          onClick={handleResendVerificationCode}
        >
          Resend code
        </button>
      )}
    </>
  );
};
