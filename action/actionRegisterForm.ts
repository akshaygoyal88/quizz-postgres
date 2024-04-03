"use server";

import { registerUser } from "@/services/user";

export async function handleRegisterForm(formData: FormData){
    const rawFormData = Object.fromEntries(formData.entries());
    const {email, password, confirmPassword, roleOfUser} = rawFormData;
    if (typeof email === "string" && typeof password === "string" && typeof roleOfUser === "string" && typeof confirmPassword === "string") {
        return await registerUser({ email, password, roleOfUser, confirmPassword });
    } else {
       return {error: "Invalid form data received"};
    }
}