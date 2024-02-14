"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import QuestionForm from "./QuestionForm";
import { useSession } from "next-auth/react";
import { QuestionType } from "@prisma/client";
import { QuestionSubmitE } from "@/services/questions";

function AddQuestionUI() {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number[]>([]);
  const [validationError, setValidationError] = useState("");
  const [questionType, setQuestionType] = useState(QuestionType.OBJECTIVE);
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState("0");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [setId, setSetId] = useState<string | null>(null);
  const ses = useSession();
  const { data, error, isLoading } = useFetch({
    url: `${pathName.questionSetApi.path}?createdById=${
      ses.status !== "loading" && ses?.data?.id
    }`,
  });
  const [answerType, setAnswerType] = useState();

  const handleRadioChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setQuestionType(event.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setValidationError("");
    setDescription(e.target.value);
  };

  const handleCorrectOptionChange = (index: Number) => {
    setValidationError("");
    if (!correctAnswerIndex.includes(index)) {
      setCorrectAnswerIndex([...correctAnswerIndex, index]);
    } else {
      const updated = correctAnswerIndex.filter((i) => i !== index);
      setCorrectAnswerIndex(updated);
    }

    setValidationError("");
  };

  const handleOptionTextChange = (
    content: string,
    index: number,
    editor: any
  ) => {
    error && setValidationError("");
    const newOptions = [...options];
    console.log(index);
    newOptions[index] = content;
    setOptions(newOptions);
  };

  const handleOptionIncrease = () => {
    setOptions([...options, null]);
  };

  const handleOptionRemove = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handletQuesSetChange = (quesSetId: string) => {
    setValidationError("");
    // setQuestionSet(set);
    setSetId(quesSetId);
  };
  const handletQueChange = (que: string) => {
    setValidationError("");
    setQuestion(que);
  };
  const handletTimerChange = (time: string) => {
    setValidationError("");
    setTimer(time);
  };

  return (
    <QuestionForm
      question={question}
      options={options}
      correctAnswerIndex={correctAnswerIndex}
      validationError={validationError}
      questionType={questionType}
      description={description}
      timer={timer}
      successMessage={successMessage}
      data={data}
      headingText="Add Questions"
      buttonText="Save"
      handleRadioChange={handleRadioChange}
      handleOptionTextChange={handleOptionTextChange}
      handleDescriptionChange={handleDescriptionChange}
      handleCorrectOptionChange={handleCorrectOptionChange}
      handletQuesSetChange={handletQuesSetChange}
      handletQueChange={handletQueChange}
      handletTimerChange={handletTimerChange}
      action={QuestionSubmitE.ADD}
      handleOptionIncrease={handleOptionIncrease}
      handleOptionRemove={handleOptionRemove}
    />
  );
}

export default AddQuestionUI;
