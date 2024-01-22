'use server';

import { QuestionSetSubmitE, createQuestionSet, editQuestionSet } from "@/services/questionSet";

// export async function submitCreateSet(formData: FormData) {    
//     const rawFormData = Object.fromEntries(formData.entries())
//     return await createQuestionSet(rawFormData);
    
// }

// export async function editQuesSet(setId, formData: FormData) {
//     const rawFormData = Object.fromEntries(formData.entries())
//     return await editQuestionSet({id: setId, reqData: rawFormData});
// }

export async function handleQuestionSetSubmit(formData: FormData, action:QuestionSetSubmitE) {
    const rawFormData = Object.fromEntries(formData.entries())
    switch (action) {
        case QuestionSetSubmitE.CREATE:
            return await createQuestionSet(rawFormData);
    
        case QuestionSetSubmitE.EDIT:
            return await editQuestionSet({id: rawFormData.id, reqData: rawFormData});

        default:
            return {error: "Invalid action"}
    }
}