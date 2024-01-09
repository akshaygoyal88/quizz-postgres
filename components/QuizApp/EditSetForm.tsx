"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Textarea from "../Shared/Textarea";
import { useRouter } from "next/navigation";

interface QuestionSetFormProps {
  onSubmit: (formData: FormData) => void;
}

interface FormData {
  name: string;
  description?: string;
}

const EditSetForm: React.FC<QuestionSetFormProps> = ({ setId }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  console.log(setId);
  const router = useRouter();

  const getSetData = async () => {
    const res = await fetch(`/api/questionset/${setId}`, {
      method: "GET",
    });

    console.log(res);

    const data = await res.json();

    setFormData({ name: data.name, description: data.description });
    console.log(data);
  };

  useEffect(() => {
    getSetData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/questionset/${setId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.push("/quiz");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen m-4 flex flex-col items-center gap-5">
      <h1 className="font-bold text-2xl">Edit Set</h1>
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

export default EditSetForm;
