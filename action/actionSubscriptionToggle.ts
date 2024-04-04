"use server";

import { updateSubscriptionOfUser } from "@/services/quiz";


export async function handleSubscriptionToggle(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries())

    const {id, ...reqData} = rawFormData

  const res = await updateSubscriptionOfUser({id, reqData})
  return res
}
