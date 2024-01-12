"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import QuestionForm from "./QuestionForm";

function AddQuestionUI() {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [questionType, setQuestionType] = useState("objective");
  const [description, setDescription] = useState("");
  const [questionSet, setQuestionSet] = useState("");
  const [timer, setTimer] = useState("0");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { data, error, isLoading } = useFetch({
    url: `${pathName.questionSetApi.path}`,
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
    setCorrectAnswer(index);
    setValidationError("");
  };

  const handleOptionTextChange = (index: any, option: any) => {
    setValidationError("");
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
  };

  const handleSaveQuestion = async () => {
    let requestData;

    if (questionType === "objective") {
      if (
        question.trim() === "" ||
        options.some((option) => option.trim() === "")
      ) {
        setValidationError(
          "Please fill in both the question and options before saving."
        );
        return;
      }

      if (correctAnswer === null) {
        setValidationError("Please select the correct answer.");
        return;
      }
      requestData = {
        question_text: question,
        options: [...options],
        type: "OBJECTIVE",
        correctAnswer: correctAnswer,
        questionSet: questionSet,
        timer: timer,
      };
    } else if (questionType === "subjective") {
      requestData = {
        question_text: question,
        type: "SUBJECTIVE",
        description: description,
        questionSet: questionSet,
        timer: timer,
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
      setOptions(["", "", "", ""]);
      setCorrectAnswer(null);
      setValidationError("");
      setTimer("0");
      setQuestionSet("");
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

  const handletQuesSetChange = (set: string) => {
    setValidationError("");
    setQuestionSet(set);
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
      correctAnswer={correctAnswer}
      validationError={validationError}
      questionType={questionType}
      description={description}
      questionSet={questionSet}
      timer={timer}
      successMessage={successMessage}
      data={data}
      handleRadioChange={handleRadioChange}
      handleOptionTextChange={handleOptionTextChange}
      handleDescriptionChange={handleDescriptionChange}
      handleOptionChange={handleOptionChange}
      handleSaveQuestion={handleSaveQuestion}
      handletQuesSetChange={handletQuesSetChange}
      handletQueChange={handletQueChange}
      handletTimerChange={handletTimerChange}
    />
  );
}

export default AddQuestionUI;
