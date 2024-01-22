"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Textarea from "../Shared/Textarea";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { editQuesSet } from "@/action/actionSetForm";

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
    data: setsInfo,
    error: setsError,
    isLoading: setsIsLoading,
  } = useFetch({
    url: `${pathName.questionSetApi.path}/${setId}`,
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [addSetSuccessMessage, setAddSetSuccessMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const msgParam = urlSearchParams.get("msg");
      if (msgParam === "1") {
        setAddSetSuccessMessage("Set Added successfully.");
      }
    }
  }, []);

  useEffect(() => {
    if (setsInfo) {
      setFormData({ name: setsInfo.name, description: setsInfo.description });
    }
  }, [setsInfo]);

  // const handleInputChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   const {
  //     data: editSetRes,
  //     error: editSetError,
  //     isLoading: editSetIsLoading,
  //   } = await fetchData({
  //     url: `${pathName.questionSetApi.path}/${setId}`,
  //     method: FetchMethodE.PUT,
  //     body: formData,
  //   });

  //   if (!editSetError && !editSetRes?.error) {
  //     setSuccessMessage("Successfully updated");
  //     setTimeout(() => {
  //       setSuccessMessage("");
  //     }, 10000);
  //   } else if (editSetRes.error) {
  //     setError(editSetRes.error);
  //   } else {
  //     setError(editSetError);
  //   }
  // };const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   const {
  //     data: editSetRes,
  //     error: editSetError,
  //     isLoading: editSetIsLoading,
  //   } = await fetchData({
  //     url: `${pathName.questionSetApi.path}/${setId}`,
  //     method: FetchMethodE.PUT,
  //     body: formData,
  //   });

  //   if (!editSetError && !editSetRes?.error) {
  //     setSuccessMessage("Successfully updated");
  //     setTimeout(() => {
  //       setSuccessMessage("");
  //     }, 10000);
  //   } else if (editSetRes.error) {
  //     setError(editSetRes.error);
  //   } else {
  //     setError(editSetError);
  //   }
  // };

  const formAction = async (formData: FormData) => {
    const res = await editQuesSet(setId, formData);
    console.log(res);
    if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="h-screen m-4 flex flex-col items-center gap-5">
      <h1 className="font-bold text-2xl">Edit Set</h1>
      {addSetSuccessMessage && (
        <p className="bg-green-500 px-10 py-1 text-white m-3">
          {addSetSuccessMessage}
        </p>
      )}
      <form
        action={formAction}
        // onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <InputWithLabel
          type="text"
          id="name"
          name="name"
          defaultValue={formData.name}
          // onChange={handleInputChange}
          label="Name:"
          className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
        />

        <Textarea
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          // onChange={handleInputChange}
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
          Edit
        </button>
      </form>
    </div>
  );
};

export default EditSetForm;
