"use client";

import React, { useState, useEffect } from "react";
import pathName from "@/constants";
import { useFetch } from "@/hooks/useFetch";
import { QuestionSetSubmitE } from "@/services/questionSet";
import SetForm from "./SetForm";
import { useSession } from "next-auth/react";
interface QuestionSetFormProps {
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
  return (
    <SetForm
      session={session}
      action={QuestionSetSubmitE.EDIT}
      addSetSuccessMessage={addSetSuccessMessage}
      initialFormData={initialFormData}
    />
  );
};

export default EditSetForm;
