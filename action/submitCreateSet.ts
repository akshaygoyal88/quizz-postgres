'use server';

import { createQuestionSet } from "@/services/questionSet";

 
export async function submitCreateSet(formData: FormData) {
    try {
        const rawFormData = Object.fromEntries(formData.entries())
        return await createQuestionSet(rawFormData);
    } catch (error: any) {
        return {error: error?.message}
    }
}