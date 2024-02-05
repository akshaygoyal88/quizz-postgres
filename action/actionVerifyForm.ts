"use server";

import { verifyUser } from "@/Services/user";

export async function handleSubmitVerifyForm(formData: FormData){
    const rawFormData = Object.fromEntries(formData.entries());
    return await verifyUser(rawFormData);
}