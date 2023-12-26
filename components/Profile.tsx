"use client";
import { useRouter } from "next/navigation";
// import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import InputWithLabel from "./Shared/InputWithLabel";
import { FormEvent, useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
  const [error, setError] = useState<string>();
  const router = useRouter();

  const addressChange = (e: FormEvent) => {
    setAddress((e.target as HTMLInputElement).value);
  };
  const cityChange = (e: FormEvent) => {
    setCity((e.target as HTMLInputElement).value);
  };
  const pincodeChange = (e: FormEvent) => {
    if (error) setError("");
    if (!Number((e.target as HTMLInputElement).value)) {
      setPincode("");
      setError("Zipcode should be number.");
      setTimeout(() => {
        setError("");
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
    if (value) {
      const parsedPhoneNumber = parsePhoneNumber(value);
      if (parsedPhoneNumber && parsedPhoneNumber.nationalNumber.length > 10) {
        setError("Phone number should not more than 10 digits");
        setTimeout(() => setError(""), 10000);
        return;
      }
    }
    setPhoneNumber(value);
  };

  const getUserData = async () => {
    try {
      const res = await fetch("/api/user/", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setUserData({ ...data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsedPhoneNumber = phoneNumber && parsePhoneNumber(phoneNumber);
    if (parsedPhoneNumber && parsedPhoneNumber.nationalNumber.length !== 10) {
      console.log(parsedPhoneNumber.nationalNumber);
      setError("Phone number should not less than 10 digits");
      setTimeout(() => setError(""), 10000);
      return;
    }

    const setValues = async () => {
      let updatedUserNewData = {};

      if (phoneNumber) {
        updatedUserNewData = {
          ...updatedUserNewData,
          mobile_number: phoneNumber,
        };
      }
      if (firstName) {
        updatedUserNewData = { ...updatedUserNewData, first_name: firstName };
      }
      if (lastName) {
        updatedUserNewData = { ...updatedUserNewData, last_name: lastName };
      }
      if (address) {
        updatedUserNewData = { ...updatedUserNewData, address };
      }
      if (country) {
        updatedUserNewData = { ...updatedUserNewData, country: country };
      }
      if (state) {
        updatedUserNewData = { ...updatedUserNewData, state };
      }
      if (city) {
        updatedUserNewData = { ...updatedUserNewData, city };
      }
      if (pincode) {
        updatedUserNewData = { ...updatedUserNewData, pincode };
      }
      return updatedUserNewData;
    };

    const data = await setValues();
    try {
      const res = await fetch("/api/updateProfile", {
        method: "PUT",
        body: JSON.stringify({ ...data }),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.error) {
          setError(resData.error);
          setTimeout(() => setError(""), 10000);
          return;
        }
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 flex flex-col items-center justify-center"
    >
      <div className="space-y-12">
        <h1 className="font-bold text-2xl">Profile</h1>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <InputWithLabel
                label="First name"
                type="text"
                name="first-name"
                id="first-name"
                // autoComplete="given-name"
                value={firstName}
                defaultValue={undefined}
                onChange={firstNameChange}
                className="block w-full  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="sm:col-span-3">
              <InputWithLabel
                label="Last name"
                type="text"
                name="last-name"
                id="last-name"
                // autoComplete="family-name"
                value={lastName}
                defaultValue={undefined}
                onChange={lastNameChange}
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
                value={email}
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
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="input-field w-full py-1.5 h-full flex-1"
                  limitMaxLength
                />
              </div>
              {error?.includes("10") &&
                error.split("/").map((err, i) => (
                  <li key={i} className="w-full text-xs text-red-600">
                    {err}
                  </li>
                ))}
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
                onChange={(val) => setState(val)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>

            <div className="col-span-full">
              <InputWithLabel
                label="Street address"
                type="text"
                name="street-address"
                id="street-address"
                value={address}
                onChange={addressChange}
                // autoComplete="street-address"
                defaultValue={undefined}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
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
                impAsterisk="*"
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <InputWithLabel
                label="ZIP / Postal code"
                type="number"
                name="postal-code"
                id="postal-code"
                value={pincode}
                onChange={pincodeChange}
                defaultValue={undefined}
                errors={
                  error?.includes("6") || error?.includes("Zipcode")
                    ? error
                    : undefined
                }
                maxLength={6}
                impAsterisk="*"
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
