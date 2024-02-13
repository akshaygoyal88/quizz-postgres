"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import InputWithLabel from "../Shared/InputWithLabel";
import Textarea from "../Shared/Textarea";
import { useRouter } from "next/navigation";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { handleQuestionSetSubmit } from "@/action/actionSetForm";
import { QuestionSetSubmitE } from "@/services/questionSet";
import { QuestionSet } from "@prisma/client";
import SetForm from "./SetForm";
import { useSession } from "next-auth/react";

interface QuestionSetFormProps {
  onSubmit: (formData: FormData) => void;
  setId: string;
}

const EditSetForm: React.FC<QuestionSetFormProps> = ({ setId }) => {
  const {
    data: setsInfo,
    error: setsError,
    isLoading: setsIsLoading,
  } = useFetch({
    url: `${pathName.questionSetApi.path}/${setId}`,
  });

  const [initialFormData, setInitialFormData] = useState<Object>({});
  const [addSetSuccessMessage, setAddSetSuccessMessage] = useState<
    string | null
  >(null);
  const session = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const msgParam = urlSearchParams.get("msg");
      if (msgParam === "1") {
        setAddSetSuccessMessage("Set Added successfully.");
        setTimeout(() => {
          setAddSetSuccessMessage(null);
        }, 10000);
      }
    }
  }, []);

  useEffect(() => {
    if (setsInfo) {
      setInitialFormData(setsInfo);
    }
  }, [setsInfo]);

  // const formAction = async (formData: FormData) => {
  //   setError("");
  //   const res = await handleQuestionSetSubmit(
  //     formData,
  //     QuestionSetSubmitE.EDIT
  //   );
  //   if (res.error) {
  //     setError(res.error);
  //   } else {
  //     setSuccessMessage("Successfully updated");
  //     setTimeout(() => {
  //       setSuccessMessage("");
  //     }, 10000);
  //   }
  // };

  return (
    <SetForm
      session={session}
      action={QuestionSetSubmitE.EDIT}
      addSetSuccessMessage={addSetSuccessMessage}
      initialFormData={initialFormData}
      // successMessage={successMessage}
    />
  );
};

export default EditSetForm;
