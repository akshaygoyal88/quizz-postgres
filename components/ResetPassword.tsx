"use client";

import { useState } from "react";
import { UserOtpType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { generateUniqueAlphanumericOTP } from "@/utils/generateOtp";
import { handleResetPassword } from "@/action/actionResetPassForm";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  const clearErrors = () => {
    setError("");
  };

  const formAction = async (formData: FormData) => {
    setError("");
    const res = await handleResetPassword(formData)
    if (res?.error) {
      setError(res.error);
    }
    if(res.message){
      setSuccess(true);
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let userId;

  //   try {
  //     const response = await fetch(`/api/useremail?email=${email}`);

  //     if (response.ok) {
  //       const result = await response.json();
  //       userId = result.user.id;
  //     } else if (response.status === 404) {
  //       setErrors(["User not found: "]);
  //     } else if (response.status === 500) {
  //       setErrors(["Server error: "]);
  //     } else {
  //       setErrors(["Unexpected error: "]);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }

  //   const token = generateUniqueAlphanumericOTP(4);

  //   try {
  //     const response = await fetch("/api/resetPassword/setResetToken/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: userId,
  //         otp: token,
  //         type: UserOtpType.RESET_TOKEN,
  //       }),
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }

  //   if (userId) {
  //     const resetLink = `/reset-password/${userId}/${token}/change-password/?userId=${userId}&token=${token}`;
  //     console.log("Reset link:", resetLink);
  //   }

  //   try {
  //     const response = await fetch("/api/sendEmail", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         to: email,
  //         subject: "Password Reset Link",
  //         text: `Click the following link to reset your password: http://localhost:3000/reset-password/${userId}/${token}/change-password/?userId=${userId}&token=${token}`,
  //       }),
  //     });

  //     if (response.ok) {
  //       console.log("Password reset email sent successfully.");
  //     } else {
  //       console.error(
  //         "Error sending password reset email:",
  //         response.statusText
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <div className="max-w-md mx-auto my-8 ">
      <form
        // onSubmit={handleSubmit}
        action={formAction}
        className="bg-white p-8 shadow-md rounded-md"
      >
        {!success && <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErrors();
            }}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>}
        {error && (
          <div className="mb-4 text-red-500">
              <p>{error}</p>
          </div>
        )}

        <div className="mt-8">
          {!success ?  <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Send Reset Link
          </button> : <p>Succfully sent reset link.</p>}
        </div>
      </form>
    </>
  );
};

export default ResetPassword;

export const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const url = useSearchParams();
  const userId = url.get("userId");
  const token = url.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      try {
        const response = await fetch("/api/resetPassword/changePassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            token: token,
            password: newPassword,
          }),
        });

        if (response.status === 201) {
          console.log("Password changed successfully");
        } else if (response.status === 400) {
          const data = await response.json();
          setErrorMessage(data.error);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Passwords do not match");
      setPasswordsMatch(false);
      setErrorMessage("Passwords not match");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="newPassword"
          className="block text-gray-600 font-semibold mb-2"
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-gray-600 font-semibold mb-2"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordsMatch(true);
            setErrorMessage("");
          }}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
            passwordsMatch ? "focus:border-blue-500" : "border-red-500"
          }`}
          required
        />
        {errorMessage.length > 0 && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
