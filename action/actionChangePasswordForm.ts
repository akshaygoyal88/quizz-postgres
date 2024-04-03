"use server";

import { changeUserPassword } from "@/services/resetPasswordService";


export async function handleChangePasswordForm(formData: FormData) {
  const { newPassword, confirmPassword, userId, token } = Object.fromEntries(
    formData.entries()
  ) as {
    newPassword: string;
    confirmPassword: string;
    userId: string;
    token: string;
  };

  return await changeUserPassword({
    newPassword,
    confirmPassword,
    userId,
    token,
  });
}
