"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { QuestionSetSubmitE } from "@/services/questionSet";
import SetForm from "./SetForm";

const CreateSetForm = () => {
  const session = useSession();
  return <SetForm session={session} action={QuestionSetSubmitE.CREATE} />;
};

export default CreateSetForm;
