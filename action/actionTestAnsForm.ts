"use server";

import { saveResponseForQues } from "@/services/answerSubmission";

export async function handleAnsSubmission(formData: FormData){
    const rawFormData = Object.fromEntries(formData.entries());
    const res = await saveResponseForQues(rawFormData);
    return res;
}