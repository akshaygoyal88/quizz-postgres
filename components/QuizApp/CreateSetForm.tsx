"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Textarea from "../Shared/Textarea";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { FetchMethodE, useFetch } from "@/hooks/useFetch";
import { error } from "console";

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

  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const {
    data: saveQueSetRes,
    error: saveQueSetError,
    isLoading: saveQueSetIsLoading,
    fetchData,
  } = useFetch({
    url: `${pathName.questionSetApi.path}`,
    method: FetchMethodE.POST,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await fetchData(formData);
    if (!saveQueSetError && !saveQueSetRes.error) {
      router.push(`${pathName.quiz.path}`);
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

        <Textarea
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
        />
        <div className="text-red-500 mb-2">{saveQueSetError}</div>
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
