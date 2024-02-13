"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Textarea from "../Shared/Textarea";
import { useSession } from "next-auth/react";
import { handleQuestionSetSubmit } from "@/action/actionSetForm";
import { QuestionSetSubmitE } from "@/services/questionSet";
import pathName from "@/constants";
import { useRouter } from "next/navigation";
import SetForm from "./SetForm";

interface QuestionSetFormProps {
  onSubmit: (formData: FormData) => void;
}
const initialState = {
  message: null,
};

interface FormData {
  name: string;
  description?: string;
}

const CreateSetForm: React.FC<QuestionSetFormProps> = () => {
  const session = useSession();
  return <SetForm session={session} action={QuestionSetSubmitE.CREATE} />;
};

export default CreateSetForm;
