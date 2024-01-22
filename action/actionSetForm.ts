'use server';

import { createQuestionSet, editQuestionSet } from "@/services/questionSet";

 
export async function submitCreateSet(formData: FormData) {
    try {
        const rawFormData = Object.fromEntries(formData.entries())
        return await createQuestionSet(rawFormData);
    } catch (error: any) {
        return {error: error?.message}
    }
}

export async function editQuesSet(setId, formData: FormData) {
    try {
        const rawFormData = Object.fromEntries(formData.entries())
        return await editQuestionSet({id: setId, reqData: rawFormData});
    } catch (error: any) {
        return {error: error?.message}
    }
}