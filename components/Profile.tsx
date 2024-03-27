"use client";
import { useRouter } from "next/navigation";
import InputWithLabel from "./Shared/InputWithLabel";
import { FormEvent, useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { handleProfileSubmit } from "@/action/actionProfileForm";
import { UserDataType } from "@/types/types";
import Form from "./Shared/Form";
import Heading from "./Shared/Heading";
import CustomImage from "./Shared/CustomImage";
import { Button } from "./Shared/Button";
import CustomGrid from "./Shared/CustomGrid";

export interface FormErrors {
  id?: string;
  mobile_number?: string;
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
}

export default function Profile({ userData }: { userData: UserDataType }) {
  const [country, setCountry] = useState<string>(userData.country || "");
  const [state, setState] = useState<string>(userData.state || "");
  const [error, setError] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const pincodeChange = (e: FormEvent) => {
    if (error) setError({});
    if (!Number((e.target as HTMLInputElement).value)) {
      setError({ pincode: "Zipcode should be number." });
    }
    if (Number((e.target as HTMLInputElement).value) > 999999) {
      setError({ pincode: "Zipcode should be more than 6 digits." });
    }
  };

  const handlePhoneChange = (value: string) => {
    delete error.mobile_number;
    if (value) {
      const parsedPhoneNumber = parsePhoneNumber(value);
      if (parsedPhoneNumber && parsedPhoneNumber.nationalNumber.length >= 11) {
        setError({
          mobile_number: "Phone number should not more than 10 digits",
        });
      }
    }
  };

  const formAction = async (formData: FormData) => {
    formData.append("id", userData.id);
    const res = await handleProfileSubmit(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
  };

  const handleImageUpload = async () => {};

  return (
    <Form
      classes="p-4 flex flex-col items-center justify-center"
      action={formAction}
      success={success ? "Succesfully saved." : null}
      button={[<Button type="submit">Save</Button>]}
      error={error.id}
    >
      <Heading headingText="Profile" tag="h1" />
      <CustomGrid
        customClasses="gap-x-8 gap-y-10 max-w-2xl border-gray-900/10 py-6 sm:grid-cols-6"
        columns={1}
      >
        <CustomImage
          className="sm:col-span-3 w-1/2"
          src={`${userData?.profile_pic}`}
          alt={"user image"}
        />
        <InputWithLabel
          label="Image"
          type="file"
          accept="image/*"
          id="image"
          // name="image"
          onChange={handleImageUpload}
          columnClass="sm:col-span-3"
        />

        <InputWithLabel
          label="First name"
          type="text"
          name="first_name"
          id="first-name"
          defaultValue={`${userData?.first_name}`}
          columnClass="sm:col-span-3"
          className="block w-full  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <InputWithLabel
          label="Last name"
          type="text"
          name="last_name"
          id="last-name"
          defaultValue={`${userData?.last_name}`}
          columnClass="sm:col-span-3"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <InputWithLabel
          label="Email"
          id="email"
          name="email"
          type="email"
          disabled={true}
          value={userData?.email!}
          defaultValue={undefined}
          impAsterisk="*"
          columnClass="sm:col-span-3"
          className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <div className="sm:col-span-3">
          <label
            htmlFor="phone"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            <span className="text-red-500">*</span>Phone Number
          </label>
          <div className="block pl-3 w-full rounded-md border-0 pr-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <PhoneInput
              international
              defaultCountry="IN"
              name="mobile_number"
              value={userData?.mobile_number!}
              onChange={handlePhoneChange}
              className="input-field w-full py-1.5 h-full flex-1"
              limitMaxLength
            />
          </div>
          {error.mobile_number && (
            <li className="w-full text-xs text-red-600">
              {error.mobile_number}
            </li>
          )}
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="country"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            <span className="text-red-500">*</span>Country
          </label>
          <CountryDropdown
            id="country"
            name="country"
            value={country}
            onChange={(val) => setCountry(val)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          />
          {error.country && (
            <li className="w-full text-xs text-red-600">{error.country}</li>
          )}
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="region"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            <span className="text-red-500">*</span>State / Province
          </label>
          <RegionDropdown
            country={country}
            value={state}
            name="state"
            onChange={(val) => setState(val)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          />
          {error.state && (
            <li className="w-full text-xs text-red-600">{error.state}</li>
          )}
        </div>

        <InputWithLabel
          label="City"
          type="text"
          name="city"
          id="city"
          defaultValue={`${userData?.city}`}
          errors={error.city}
          impAsterisk="*"
          columnClass="sm:col-span-3 sm:col-start-1"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <InputWithLabel
          label="ZIP / Postal code"
          type="number"
          name="pincode"
          id="postal-code"
          // onChange={pincodeChange}
          defaultValue={`${userData?.pincode}`}
          errors={error.pincode}
          columnClass="sm:col-span-3"
          impAsterisk="*"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <InputWithLabel
          label="Street address"
          type="text"
          name="address"
          id="street-address"
          defaultValue={`${userData?.address}`}
          columnClass="col-span-full"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </CustomGrid>
    </Form>
  );
}
