"use server";

import { UserSerivce } from "@/services";

export async function handleSubmitVerifyForm(formData: FormData){
    const rawFormData = Object.fromEntries(formData.entries());
    return await UserSerivce.verifyUser(rawFormData);
}