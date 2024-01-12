"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Textarea from "../Shared/Textarea";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, useFetch } from "@/hooks/useFetch";

interface QuestionSetFormProps {
  onSubmit: (formData: FormData) => void;
  setId: string;
}

interface FormData {
  name: string;
  description?: string;
}

const EditSetForm: React.FC<QuestionSetFormProps> = ({ setId }) => {
  const {
    data: setInfo,
    error: setError,
    isLoading: isLoadingSet,
  } = useFetch({
    url: `${pathName.questionSetApi.path}/${setId}`,
    method: FetchMethodE.GET,
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (setInfo) {
      setFormData({ name: setInfo.name, description: setInfo.description });
    }
  }, [setInfo]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const {
    data: editSetRes,
    error: editSetError,
    isLoading: editSetIsLoading,
    fetchData,
  } = useFetch({
    url: `${pathName.questionSetApi.path}/${setId}`,
    method: FetchMethodE.PUT,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await fetchData(formData);

    if (!editSetError && !editSetRes.error) {
      setSuccessMessage("Successfully updated");
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    } else if (editSetRes.error) {
      setError(editSetRes.error);
    } else {
      setError(editSetError);
    }
  };

  return (
    <div className="h-screen m-4 flex flex-col items-center gap-5">
      <h1 className="font-bold text-2xl">Edit Set</h1>
      {isLoadingSet && <p>Loading...</p>}
      {!isLoadingSet && setInfo && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputWithLabel
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            label="Name:"
            className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
          />

          <Textarea
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
          />
          {successMessage && (
            <p className="bg-green-600 px-4 py-2 text-white m-3">
              {successMessage}
            </p>
          )}

          <div className="text-red-500 mb-2">{error}</div>

          <button
            className="bg-gray-500 text-white font-semibold px-4 py-2"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default EditSetForm;
