import { db } from "@/db";
import { UserSerivce } from "@/services";
import { NextResponse } from "next/server";

export async function PUT(request: Request, {params}) {
  const id = params.id;

  const newData = await request.json();
  let result;

  const missingFields = [];

  // Validate mandatory fields
  if (!newData.mobile_number) {
    missingFields.push("mobile_number");
  }
  if (!newData.country) {
    missingFields.push("country");
  }
  if (!newData.state) {
    missingFields.push("state");
  }
  if (!newData.city) {
    missingFields.push("city");
  }
  if (!newData.pincode) {
    missingFields.push("pincode");
  }

  if (missingFields.length > 0) {
    const errorObj: { [key: string]: string } = {};
    for (let i = 0; i < missingFields.length; i++) {
      errorObj[missingFields[i]] = "Mandatory field.";
    }
    result = { error: errorObj };
  } else if (newData.pincode.length < 6) {
    result = { error:{pincode:  "Pincode should be at least 6 characters." }};
  } else if (newData.pincode.length > 6) {
    result = { error: {pincode: "Pincode should not be more than 6 characters."} };
  } else if (newData.mobile_number.length <= 12){
    result = { error: {mobile_number: "Phone number should not be less than 10."} };
  }else if (newData.mobile_number.length > 13){
    result = { error: {mobile_number: "Phone number should not be more than 10."} };
  }else {
    result = await UserSerivce.updateProfile({id, ...newData});
    
  }
  return NextResponse.json(result);
}
