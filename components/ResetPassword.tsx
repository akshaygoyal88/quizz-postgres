"use client";

import { useState } from "react";
import { handleResetPassword } from "@/action/actionResetPassForm";
import Heading from "./Shared/Heading";
import Form, { FormInputs } from "./Shared/Form";
import { Button } from "./Shared/Button";
import { handleChangePasswordForm } from "@/action/actionChangePasswordForm";

const ResetPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formAction = async (formData: FormData) => {
    setError(null);
    const res = await handleResetPassword(formData);
    if (res?.error) {
      setError(res.error);
    }
    if (res.message) {
      setSuccess("Succfully sent reset link.");
    }
  };

  return (
    <>
      <Heading headingText="Reset Password" tag="h2" />
      <span className="mt-10 flex flex-col items-center">{success}</span>
      {!success && (
        <Form
          classes={""}
          error={error}
          success={success}
          action={formAction}
          button={[
            <Button type="submit" className="mt-8">
              Send Reset Link
            </Button>,
          ]}
        >
          <FormInputs
            inputList={[
              {
                type: "email",
                id: "email",
                name: "email",
                label: "Email",
                placeholder: "user@mail.com",
              },
            ]}
          />
        </Form>
      )}
    </>
  );
};

export default ResetPassword;

export const ChangePassword = ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formAction = async (formData: FormData) => {
    formData.append("userId", userId);
    formData.append("token", token);
    const res = await handleChangePasswordForm(formData);
    if (!res.error) {
      setSuccessMessage("Password changed successfully");
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };
  return (
    <>
      <Heading headingText="Change Password" tag="h2" />
      {!successMessage ? (
        <Form
          classes="my-10 space-y-4"
          error={errorMessage}
          action={formAction}
          button={[<Button type="submit">Submit</Button>]}
        >
          <FormInputs
            inputList={[
              {
                type: "password",
                id: "newPassword",
                name: "newPassword",
                placeholder: "New Password",
                label: "New Password",
              },
              {
                type: "password",
                id: "confirmPassword",
                name: "confirmPassword",
                placeholder: "Confirm Password",
                label: "confirmPassword",
              },
            ]}
          />
        </Form>
      ) : (
        <span className=" text-green-500 flex flex-col mt-10 items-center">
          {successMessage}
        </span>
      )}
    </>
  );
};
