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
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
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

  const handleRadioChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setQuestionType(event.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setValidationError("");
    setDescription(e.target.value);
  };

  const handleOptionChange = (index: any) => {
    setValidationError("");
    setCorrectAnswerIndex(index);
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
  const handleSaveQuestion = async () => {
    let requestData;

    if (questionType === QuestionType.OBJECTIVE) {
      if (
        question.trim() === "" ||
        options.some((option) => option.trim() === "")
      ) {
        setValidationError(
          "Please fill in both the question and options before saving."
        );
        return;
      }

      if (correctAnswerIndex === null) {
        setValidationError("Please select the correct answer.");
        return;
      }
      console.log(options);
      requestData = {
        question_text: question,
        options: [...options],
        type: QuestionType.OBJECTIVE,
        correctAnswer: correctAnswerIndex,
        // questionSet: questionSet,
        timer: timer,
        createdById: ses?.data?.id,
        setId,
      };
    } else if (questionType === QuestionType.SUBJECTIVE) {
      requestData = {
        question_text: question,
        type: QuestionType.SUBJECTIVE,
        description: description,
        // questionSet: questionSet,
        timer: timer,
        createdById: ses?.data?.id,
        setId,
      };
    }

    const {
      data: saveQuesRes,
      error: saveQuesError,
      isLoading: saveQuesIsLoading,
    } = await fetchData({
      url: `${pathName.questionsApiPath.path}`,
      method: FetchMethodE.POST,
      body: requestData,
    });
    if (saveQuesRes && !saveQuesRes?.error) {
      setQuestion("");
      setOptions([null]);
      setCorrectAnswerIndex(null);
      setValidationError("");
      setTimer("0");
      setSuccessMessage("Successfully added Question.");
      setDescription("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    } else if (saveQuesRes?.error) {
      setValidationError(saveQuesRes?.error);
    } else {
      setValidationError(saveQuesError);
    }
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

  console.log("options>>>>>>>>>>>>.", options);
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
      handleOptionChange={handleOptionChange}
      handleSaveQuestion={handleSaveQuestion}
      handletQuesSetChange={handletQuesSetChange}
      handletQueChange={handletQueChange}
      handletTimerChange={handletTimerChange}
      action={QuestionSubmitE.ADD}
      handleOptionIncrease={handleOptionIncrease}
    />
  );
}

export default AddQuestionUI;
