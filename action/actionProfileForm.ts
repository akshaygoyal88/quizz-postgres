"use server";

import { FormErrors } from "@/components/Profile";
import { UserSerivce } from "@/services";

export async function handleProfileSubmit(formData: FormData): Promise<{ error?: FormErrors }> {
    const rawFormData = Object.fromEntries(formData.entries());
    delete rawFormData.mobile_numberCountry;
    let result;
    const missingFields = [];

    if (!rawFormData.mobile_number) {
        missingFields.push("mobile_number");
    }
    if (!rawFormData.country) {
        missingFields.push("country");
    }
    if (!rawFormData.state) {
        missingFields.push("state");
    }
    if (!rawFormData.city) {
        missingFields.push("city");
    }
    if (!rawFormData.pincode) {
        missingFields.push("pincode");
    }

    if (missingFields.length > 0) {
        const errorObj: { [key: string]: string } = {};
        for (let i = 0; i < missingFields.length; i++) {
        errorObj[missingFields[i]] = "Mandatory field.";
        }
        result = { error: errorObj };
    } else if (typeof rawFormData.pincode !== 'string' || rawFormData.pincode.length < 6) {
        result = { error:{pincode:  "Pincode should be at least 6 characters." }};
    } else if (typeof rawFormData.pincode !== 'string' || rawFormData.pincode.length > 6) {
        result = { error: {pincode: "Pincode should not be more than 6 characters."} };
    } else if (typeof rawFormData.mobile_number !== 'string' || rawFormData.mobile_number.length <= 15){
        result = { error: {mobile_number: "Phone number should not be less than 10."} };
    } else if (typeof rawFormData.mobile_number !== 'string' || rawFormData.mobile_number.length > 16){
        result = { error: {mobile_number: "Phone number should not be more than 10."} };
    } else {
        
        return await UserSerivce.updateProfile(rawFormData);
    }
    return result
}
