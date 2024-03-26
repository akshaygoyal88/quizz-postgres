"use client";

import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
import { AnswerTypeE, QuestionType, Quiz, User } from "@prisma/client";
import { QuestionSubmitE } from "@/services/questions";
import { UserDataType } from "@/types/types";

function AddQuestionUI({
  userData,
  quizzes,
}: {
  userData: UserDataType;
  quizzes: Quiz[];
}) {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [questionType, setQuestionType] = useState(QuestionType.OBJECTIVE);
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState("0");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [setId, setSetId] = useState<string | null>(null);
  const [objAnsType, setObjAnsType] = useState<AnswerTypeE>(
    AnswerTypeE.SINGLECHOICE
  );

  const handleRadioChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setQuestionType(event.target.value);
  };

  const handleAnyTypeRadioChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (
      objAnsType === AnswerTypeE.MULTIPLECHOICE &&
      correctAnswerIndex.length > 1
    ) {
      setValidationError("Please select only one option for single choice");
      setTimeout(() => {
        setValidationError("");
      }, 8000);
      return;
    }
    setObjAnsType(event.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setValidationError("");
    setDescription(e.target.value);
  };

  const handleCorrectOptionChange = (index: Number) => {
    if (
      (objAnsType === AnswerTypeE.MULTIPLECHOICE ||
        correctAnswerIndex.length == 0) &&
      !correctAnswerIndex.includes(index)
    ) {
      setCorrectAnswerIndex([...correctAnswerIndex, index]);
    } else if (
      objAnsType === AnswerTypeE.SINGLECHOICE &&
      correctAnswerIndex.length === 0
    ) {
      setCorrectAnswerIndex([index]);
    } else {
      const updated = correctAnswerIndex.filter((i) => i !== index);
      setCorrectAnswerIndex(updated);
    }
    setTimeout(() => {
      setValidationError("");
    }, 10000);
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
      quizzes={quizzes}
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
      handleAnyTypeRadioChange={handleAnyTypeRadioChange}
      objAnsType={objAnsType}
    />
  );
}

export default AddQuestionUI;
