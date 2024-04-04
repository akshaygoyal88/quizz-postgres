"use client";
import React, { useEffect, useState } from "react";
import InputWithLabel from "../../Shared/InputWithLabel";
import { handleQuestionSetSubmit } from "@/action/actionSetForm";
import { QuestionSetSubmitE } from "@/services/questionSet";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import TinyMCEEditor from "../../Shared/TinyMCEEditor";
import { Button } from "../../Shared/Button";
import { UserDataType, imageS3 } from "@/types/types";
import Heading from "@/components/Shared/Heading";
import Form from "@/components/Shared/Form";
import { Container } from "@/components/Container";
import { QuizCreationStatusE } from "@prisma/client";

interface FormDataProps {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  isDeleted: boolean;
  price: number | null;
  status: string | null;
}

export default function QuizForm({
  userData,
  action,
  addSetSuccessMessage,
  initialFormData,
  imagesList,
}: // successMessage,

{
  userData: UserDataType;
  action: QuestionSetSubmitE;
  addSetSuccessMessage?: string | null;
  initialFormData?: FormDataProps;
  imagesList?: imageS3[];
}) {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>();
  const router = useRouter();

  const formAction = async (formData: FormData) => {
    setError("");
    formData.append("description", editorContent as string);
    formData.append("id", initialFormData?.id as string);
    formData.append("createdById", userData?.id as string);
    const res: FormDataProps | { error: string } =
      await handleQuestionSetSubmit(formData, action);

    if (res && res.error) {
      setError(res.error);
    } else {
      action === QuestionSetSubmitE.CREATE &&
        router.push(`${pathName.quiz.path}/${res?.id}/edit?msg=1`);
      action === QuestionSetSubmitE.EDIT &&
        setSuccessMessage("Successfully updated");
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    }
  };

  const handleEditorChange = (content: string, editor: any) => {
    setEditorContent(content);
  };
  return (
    <Form
      action={formAction}
      success={successMessage || addSetSuccessMessage}
      error={error}
    >
      <div className="flex flex-wrap justify-between items-center lg:flex-row">
        <Heading
          headingText={action === "create" ? "Create Quiz" : "Edit Quiz"}
          tag="h1"
        />
        <Button color="blue">
          {action === QuestionSetSubmitE.CREATE ? "Create" : "Update"}
        </Button>
      </div>
      <InputWithLabel
        type="text"
        id="name"
        name="name"
        label="Name:"
        className="block w-full rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6"
        defaultValue={initialFormData?.name}
      />
      <div className="flex flex-col justify-between">
        <label className="block text-sm font-medium leading-6 text-gray-900">
          Status:
        </label>
        <select
          defaultValue={initialFormData?.status! || ""}
          name="status"
          className="w-full px-4 py-2 rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6 bg-white"
        >
          <option value="">Select</option>
          <option value={QuizCreationStatusE.PUBLISH}>Publish</option>
          <option value={QuizCreationStatusE.DRAFT}>Draft</option>
          <option value={QuizCreationStatusE.FREE}>Free</option>
          <option value={QuizCreationStatusE.DELETE}>Archived/Delete</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">
          Description:
        </label>
        <TinyMCEEditor
          editorsContent={initialFormData?.description}
          handleEditorChange={handleEditorChange}
          imagesList={imagesList}
          idx="quesset"
        />
      </div>
      <InputWithLabel
        type="number"
        id="price"
        name="price"
        label="Price:"
        className="block w-full rounded-md border-0 py-2 px-2 ring-1 ring-inset sm:text-sm sm:leading-6"
        step="0.1"
        min="0"
        value={undefined}
        defaultValue={`${initialFormData?.price}`}
      />
    </Form>
  );
}
