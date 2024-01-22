"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Textarea from "../Shared/Textarea";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useSession } from "next-auth/react";

interface QuestionSetFormProps {
  onSubmit: (formData: FormData) => void;
}

interface FormData {
  name: string;
  description?: string;
}

const CreateSetForm: React.FC<QuestionSetFormProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const session = useSession();

  const reqData = { ...formData, createdById: session?.data?.id };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const {
      data: saveQueSetRes,
      error: saveQueSetError,
      isLoading: saveQueSetIsLoading,
    } = await fetchData({
      url: `${pathName.questionSetApi.path}`,
      method: FetchMethodE.POST,
      body: reqData,
    });
    if (!saveQueSetError && !saveQueSetRes?.error) {
      saveQueSetRes?.id
        ? router.push(`${pathName.quiz.path}/${saveQueSetRes?.id}/edit?msg=1`)
        : setError(saveQueSetRes.error);
    } else if (saveQueSetRes.error) {
      setError(saveQueSetRes.error);
    }
  };

  return (
    <div className="h-screen m-4 flex flex-col items-center gap-5">
      <h1 className="font-bold text-2xl">Create Set</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputWithLabel
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          label="Name:"
          className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
          defaultValue={undefined}
        />
        <div className="flex flex-col justify-between">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Action:
          </label>
          <select className="w-full px-4 py-2 rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6 bg-white">
            <option>Publish</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>

        <Textarea
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
        />
        <InputWithLabel
          type="number"
          id="price"
          name="price"
          // onChange={handleInputChange}
          label="Price:"
          className="block w-full rounded-md border-0 py-2 px-2 ring-1 ring-inset sm:text-sm sm:leading-6"
          defaultValue={undefined}
          step="0.1"
          value={undefined}
        />
        <p className="text-red-500 mb-2">{error}</p>
        <button
          className="bg-gray-500 text-white font-semibold px-4 py-2"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateSetForm;
