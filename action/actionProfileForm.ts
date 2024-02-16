"use server";

import { UserSerivce } from "@/services";

export async function handleProfileSubmit(formData: FormData){
    const rawFormData = Object.fromEntries(formData.entries());
    console.log("profile", rawFormData);
    delete rawFormData.mobile_numberCountry
    let result;
    const missingFields = [];
    console.log(rawFormData.mobile_number.length)
    // Validate mandatory fields
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
    } else if (rawFormData.pincode.length < 6) {
        result = { error:{pincode:  "Pincode should be at least 6 characters." }};
    } else if (rawFormData.pincode.length > 6) {
        result = { error: {pincode: "Pincode should not be more than 6 characters."} };
    } else if (rawFormData.mobile_number.length <= 15){
        
        result = { error: {mobile_number: "Phone number should not be less than 10."} };
    }else if (rawFormData.mobile_number.length > 16){
        result = { error: {mobile_number: "Phone number should not be more than 10."} };
    }else {
        const result = await UserSerivce.updateProfile(rawFormData);
    }
    return result
}