"use server";

import { resetPasswordService } from "@/services/resetPasswordService";

export async function handleResetPassword(formData: FormData) {
  const rawFormData: any = Object.fromEntries(formData.entries());
  return await resetPasswordService(rawFormData);
}
