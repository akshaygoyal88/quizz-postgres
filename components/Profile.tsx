"use client";
import { useRouter } from "next/navigation";
// import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import InputWithLabel from "./Shared/InputWithLabel";
import { FormEvent, useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import pathName from "@/constants";
import { useSession } from "next-auth/react";
import { useFetch } from "@/hooks/useFetch";
import { handleProfileSubmit } from "@/action/actionProfileForm";

interface UserEmail {
  email?: string;
}

interface UserData {
  pincode: string;
  state: string;
  city: string;
  country: string;
  email?: string;
  mobile_number?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
}

interface FormErrors {
  mobile_number?: string;
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
  // Add other error fields as needed
}

export default function Profile({ email }: UserEmail) {
  const [userData, setUserData] = useState<UserData>({});
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<FormErrors>({});
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const session = useSession();

  const addressChange = (e: FormEvent) => {
    setAddress((e.target as HTMLInputElement).value);
  };
  const cityChange = (e: FormEvent) => {
    delete error.city;
    setCity((e.target as HTMLInputElement).value);
  };
  const pincodeChange = (e: FormEvent) => {
    if (error) setError({});
    if (!Number((e.target as HTMLInputElement).value)) {
      setPincode("");
      setError({ pincode: "Zipcode should be number." });
      setTimeout(() => {
        setError({});
      }, 15000);
    } else {
      setPincode((e.target as HTMLInputElement).value);
    }
  };
  const firstNameChange = (e: FormEvent) => {
    setFirstName((e.target as HTMLInputElement).value);
  };
  const lastNameChange = (e: FormEvent) => {
    setLastName((e.target as HTMLInputElement).value);
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
    setPhoneNumber(value);
  };
  const {
    data: proData,
    error: proDataErr,
    isLoading: proDataIsloading,
  } = useFetch({
    url: `${pathName.userApi.path}/${session?.data?.id}`,
  });

  useEffect(() => {
    setUserData({ ...proData });
  }, [proData]);

  useEffect(() => {
    setPhoneNumber(userData.mobile_number || "");
    setFirstName(userData.first_name || "");
    setLastName(userData.last_name || "");
    setAddress(userData.address || "");
    setCountry(userData.country || "");
    setCity(userData.city || "");
    setState(userData.state || "");
    setPincode(userData.pincode || "");
  }, [userData]);

  // todo remove state and do it from user data

  const formAction = async (formData: FormData) => {
    const res = await handleProfileSubmit(formData);
    console.log(res);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 10000);
    }
  };

  return (
    <form
      className="p-4 flex flex-col items-center justify-center"
      action={formAction}
    >
      <div className="space-y-12">
        <h1 className="font-bold text-2xl">Profile</h1>
        {success && <p className="text-green-500">Succesfully saved.</p>}

        <input type="hidden" name="id" value={session?.data?.id} />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <InputWithLabel
                label="First name"
                type="text"
                name="first_name"
                id="first-name"
                // autoComplete="given-name"
                value={firstName}
                defaultValue={undefined}
                // onChange={firstNameChange}
                className="block w-full  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="sm:col-span-3">
              <InputWithLabel
                label="Last name"
                type="text"
                name="last_name"
                id="last-name"
                // autoComplete="family-name"
                value={lastName}
                defaultValue={undefined}
                // onChange={lastNameChange}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <InputWithLabel
                label="Email"
                id="email"
                name="email"
                type="email"
                // autoComplete="email"
                disabled={true}
                value={proData?.email}
                defaultValue={undefined}
                impAsterisk="*"
                className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

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
                  value={phoneNumber}
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

            <div className="sm:col-span-3 sm:col-start-1">
              <InputWithLabel
                label="City"
                type="text"
                name="city"
                id="city"
                value={city}
                // autoComplete="address-level2"
                onChange={cityChange}
                defaultValue={undefined}
                errors={error.city}
                impAsterisk="*"
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <InputWithLabel
                label="ZIP / Postal code"
                type="number"
                name="pincode"
                id="postal-code"
                value={pincode}
                onChange={pincodeChange}
                defaultValue={undefined}
                errors={
                  // (typeof error === "string" && error?.includes("6")) ||
                  // (typeof error === "string" && error?.includes("Zipcode"))
                  //   ? error
                  //   : undefined
                  error.pincode
                }
                impAsterisk="*"
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="col-span-full">
              <InputWithLabel
                label="Street address"
                type="text"
                name="address"
                id="street-address"
                value={address}
                // onChange={addressChange}
                // autoComplete="street-address"
                defaultValue={undefined}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-x-6 ">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
