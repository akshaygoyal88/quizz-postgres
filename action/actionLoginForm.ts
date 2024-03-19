"use server";

import { registerUser, signInUser } from "@/services/user";

export async function handleLoginForm(formData: FormData){
    const rawFormData = Object.fromEntries(formData.entries());
    console.log(rawFormData);
    const {email, password} = rawFormData;
    if (typeof email === "string" && typeof password === "string") {
        return await signInUser({ email, password, });
    } else {
       return {error: "Invalid form data received"};
    }
}