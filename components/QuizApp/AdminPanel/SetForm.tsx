import React, { useEffect, useState } from "react";
import InputWithLabel from "../../Shared/InputWithLabel";
import { handleQuestionSetSubmit } from "@/action/actionSetForm";
import { QuestionSetSubmitE } from "@/services/questionSet";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { QuestionSet, User } from "@prisma/client";
import TinyMCEEditor from "../UI/TinyMCEEditor";
import { Button } from "../../Button";

export default function SetForm({
  session,
  action,
  addSetSuccessMessage,
  initialFormData,
}: // successMessage,
{
  session: User;
  action: QuestionSetSubmitE;
  addSetSuccessMessage?: string;
  initialFormData?: QuestionSet;
}) {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string | null>(null);
  const router = useRouter();
  const [imagesList, setImagesList] = useState([]);

  useEffect(() => {
    fetchImagesFromS3();
  }, []);

  const fetchImagesFromS3 = async () => {
    try {
      const response = await fetch("/api/fetchImages");
      if (!response.ok) {
        throw new Error("Failed to fetch images from S3");
      }
      const imageList = await response.json();

      setImagesList(imageList);
    } catch (error) {
      setError(error);
    }
  };

  const formAction = async (formData: FormData) => {
    setError("");
    formData.append("description", editorContent as string);
    const res = await handleQuestionSetSubmit(formData, action);

    if (res?.error) {
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
    <form action={formAction} className="flex flex-col p-4 gap-5">
      {addSetSuccessMessage && (
        <p className="bg-green-500 px-10 py-1 text-white m-3">
          {addSetSuccessMessage}
        </p>
      )}
      <div className="flex flex-wrap justify-between items-center lg:flex-row">
        <h1 className="font-bold text-2xl">
          {action === "create" ? "Create Quiz" : "Edit Quiz"}
        </h1>
        <Button color="blue">{action}</Button>
      </div>
      <input type="hidden" name="id" value={initialFormData?.id} />
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
          defaultValue={initialFormData?.action}
          name="status"
          className="w-full px-4 py-2 rounded-md border-0 p-1.5 pr-10  ring-1 ring-inset sm:text-sm sm:leading-6 bg-white"
        >
          <option value="Publish">Publish</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
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
        value={undefined}
        defaultValue={initialFormData?.price}
      />
      {successMessage && (
        <p className="bg-green-600 px-4 py-2 text-white m-3">
          {successMessage}
        </p>
      )}
      <input type="hidden" name="createdById" value={session?.data?.id} />
      <p className="text-red-500 mb-2">{error}</p>
    </form>
  );
}
