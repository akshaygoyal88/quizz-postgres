"use client";
// import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import InputWithLabel from "./Shared/InputWithLabel";
import { FormEvent, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

interface UserEmail {
  email?: string;
}

export default function Profile({ email }: UserEmail) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");

  const addressChange = (e: FormEvent) => {
    setAddress((e.target as HTMLInputElement).value);
  };
  const cityChange = (e: FormEvent) => {
    setCity((e.target as HTMLInputElement).value);
  };
  const zipcodeChange = (e: FormEvent) => {
    setZipcode((e.target as HTMLInputElement).value);
  };
  const firstNameChange = (e: FormEvent) => {
    setFirstName((e.target as HTMLInputElement).value);
  };
  const lastNameChange = (e: FormEvent) => {
    setLastName((e.target as HTMLInputElement).value);
  };

  return (
    <form className="p-4 flex flex-col items-center justify-center">
      <div className="space-y-12">
        <h1 className="font-bold text-2xl">Profile</h1>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
          {/* <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
          </div> */}

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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-4">
              <InputWithLabel
                label="Email"
                id="email"
                name="email"
                type="email"
                // autoComplete="email"
                disabled={true}
                value={email}
                defaultValue={undefined}
                className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
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
                State / Province
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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <InputWithLabel
                label="ZIP / Postal code"
                type="text"
                name="postal-code"
                id="postal-code"
                value={zipcode}
                onChange={zipcodeChange}
                // autoComplete="postal-code"
                defaultValue={undefined}
                maxLength={6}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
